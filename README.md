# Terraform med AWS S3 og statiske websider

## Oppgaven

I denne øvelsen skal du hoste en React-applikasjon som viser kryptovaluta-informasjon. Applikasjonen er allerede bygget og klar til å deployes. Du skal lære hvordan Terraform brukes til å sette opp infrastrukturen som hoster den på AWS.

Du vil bruke **Infrastructure as Code (IaC)** for å automatisere hele prosessen med å sette opp:
- En S3 bucket for å hoste nettsiden
- CloudFront CDN for global distribusjon og HTTPS
- DNS-konfigurasjon for custom domenenavn
- CI/CD pipeline for automatisk deployment

## Du vil lære

Gjennom denne øvelsen lærer du om:

- **Terraform grunnleggende**: Ressurser, variabler, outputs og state management
- **AWS S3 Website Hosting**: Konfigurasjon av S3 buckets for statiske nettsider
- **CloudFront CDN**: Global distribusjon med HTTPS og caching
- **Terraform-moduler**: Bygge gjenbrukbar infrastruktur-kode
- **Remote State**: Håndtere Terraform state i team-miljøer
- **CI/CD med GitHub Actions**: Automatisere infrastruktur-deployment
- **Infrastructure as Code**: Best practices for å versjonere og administrere infrastruktur

## AWS-tjenester i denne labben

- **S3 (Simple Storage Service)**: Objektlager. Brukes til å hoste de statiske filene (HTML, CSS, JS) som utgjør nettsiden, og til å lagre Terraform state remote.
- **CloudFront**: AWS sitt CDN. Distribuerer nettsiden globalt og legger HTTPS på toppen av S3.
- **Route53**: AWS sin DNS-tjeneste. Brukes til å peke et custom domenenavn mot CloudFront-distribusjonen.
- **ACM (Certificate Manager)**: Utsteder og håndterer TLS-sertifikater. Brukes til å gi CloudFront et gyldig HTTPS-sertifikat for custom domenet.
- **IAM**: Identity and Access Management. Brukes gjennom bucket policies og GitHub Actions-credentials for å styre hvem som kan lese og endre hva.

## Forberedelser

### Om GitHub forks

En **fork** er din egen kopi av et GitHub-repo under din egen konto. Du jobber i din kopi uten å påvirke originalen, og kan senere åpne pull requests tilbake hvis du vil bidra endringer. I denne labben trenger du en fork av to grunner: du må kunne pushe commits for å teste CI/CD-pipelinen, og GitHub Actions-workflowen kjører mot secrets du selv legger inn i ditt eget repo.

### Steg 0: Opprett GitHub Codespace fra din fork

1. **Fork dette repositoriet** til din egen GitHub-konto
2. **Åpne Codespace**: Klikk på "Code" → "Codespaces" → "Create codespace on main"
3. **Vent på at Codespace starter**: Dette kan ta et par minutter første gang
4. **Terminalvindu**: Du vil utføre de fleste kommandoer i terminalen som åpner seg nederst i Codespace

**Tips**: Trykk `.` (punktum) når du er i et GitHub repository for å åpne det direkte i en nettleser-basert VS Code editor. Dette er raskere enn å starte en full Codespace for små editeringer.

### Konfigurer AWS-nøkler i Codespace

Terraform og AWS CLI trenger AWS-nøkler for å kunne snakke med AWS-kontoen din. En Codespace starter uten disse, så du må konfigurere dem én gang per Codespace.

Hent `Access Key ID` og `Secret Access Key` fra AWS Academy / IAM, og kjør:

```bash
aws configure
```

Fyll inn verdiene når du blir spurt:

- **AWS Access Key ID**: fra kontoen din
- **AWS Secret Access Key**: fra kontoen din
- **Default region name**: `eu-west-1`
- **Default output format**: `json`

Hvis du bruker AWS Academy må du i tillegg sette `AWS_SESSION_TOKEN`. Verifiser at nøklene fungerer:

```bash
aws sts get-caller-identity
```

Kommandoen skal returnere konto-ID og bruker-ARN. Får du en feilmelding, er nøklene feil eller utløpt.

**Merk**: Nøklene lagres i `~/.aws/credentials` inne i Codespacen. Hvis Codespacen slettes eller resettes, må du kjøre `aws configure` på nytt.

### Steg 1: Verifiser miljøet

Repositoriet er allerede klonet i ditt Codespace. Verifiser at du er i riktig mappe:

```bash
pwd
ls
```

Du skal se filene fra dette repositoriet, inkludert mappen `s3_demo_website`. 

### Steg 2: Opprett Terraform-konfigurasjon

Nå skal du bygge opp Terraform-konfigurasjonen fra bunnen av. Du vil lære om de ulike AWS S3-ressursene som trengs for å hoste en statisk nettside.

1. **Opprett `providers.tf`** i rotmappen av prosjektet:

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

# Alias provider for us-east-1
# Nødvendig for CloudFront ACM-sertifikater senere i oppgaven
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}
```

**Forklaring:**
- `required_version` sikrer at Terraform-versjonen er minst 1.0
- `required_providers` spesifiserer AWS provider versjon (~> 5.0 betyr versjon 5.x)
- Default provider bruker `eu-west-1`
- Aliased provider for `us-east-1` vil brukes senere for ACM-sertifikater (se [Appendix A](#appendix-a-provider-configuration-i-moduler))

2. **Opprett `main.tf`** i rotmappen av prosjektet

3. **Opprett S3 bucket-ressursen** med et hardkodet bucket-navn (erstatt `<unikt-bucket-navn>` med ditt eget unike navn, f.eks. dine initialer eller studentnummer):

**Viktig om bucket-navn:**
- S3 bucket-navn må være **globalt unike** på tvers av alle AWS-kontoer i hele verden
- Hvis noen andre allerede bruker navnet "my-website", kan du ikke bruke det samme navnet
- Bruk derfor noe unikt som dine initialer, studentnummer, eller en kombinasjon: `glennbech-pgr301-website`
- Det er også strenge regler for formatet: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html

```hcl
resource "aws_s3_bucket" "website" {
  bucket = "unikt-bucket-navn"  # Bytt til noe globalt unikt
}
```

4. **Konfigurer S3 bucket for website hosting**:

```hcl
resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}
```

5. **Åpne bucketen for offentlig tilgang** (nødvendig for static websites):

```hcl
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
```

6. **Legg til en bucket policy som tillater offentlig lesing**:

```hcl
resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.website]
}
```

7. **Legg til en output for å få URL-en til nettsiden**:

```hcl
output "s3_website_url" {
  value = "http://${aws_s3_bucket.website.bucket}.s3-website.${aws_s3_bucket.website.region}.amazonaws.com"
  description = "URL for the S3 hosted website"
}
```

### Steg 3: Deploy infrastrukturen

Nå er du klar til å deploye infrastrukturen. Sørg for at du har erstattet `unikt-bucket-navn` i `main.tf` med ditt eget unike navn.

```bash
terraform init
terraform apply
```

### Steg 4: Bygg React-applikasjonen

Før vi kan laste opp nettsiden til S3, må vi bygge React-applikasjonen. Dette kompilerer TypeScript-koden og optimaliserer alle assets for produksjon.

1. **Naviger til applikasjonsmappen**:

```bash
cd s3_demo_website
```

2. **Installer dependencies** (hvis ikke allerede gjort):

```bash
npm install
```

3. **Bygg applikasjonen**:

```bash
npm run build
```

Dette vil opprette en `dist`-mappe med den ferdige produksjonsklare nettsiden.

4. **Gå tilbake til rotmappen**:

```bash
cd ..
```

### Steg 5: Last opp filer til S3

Nå kan vi laste opp den bygde nettsiden til S3 bucketen ved hjelp av AWS CLI:

```bash
aws s3 sync s3_demo_website/dist s3://unikt-bucket-navn
```

Legg merke til at vi synkroniserer `dist`-mappen, ikke hele `s3_demo_website`-mappen. `dist`-mappen inneholder kun de optimaliserte filene som trengs for produksjon.

### Steg 6: Inspiser bucketen i AWS Console

Gå til AWS Console, og tjenesten S3, og se på objekter og bucket-egenskaper for å forstå hvordan alt er satt opp.

### Steg 7: Åpne nettsiden

Hent URL-en til nettsiden:

```bash
terraform output s3_website_url
```

Åpne URL-en i nettleseren for å se din statiske nettside.

### Steg 8: Refaktorer til å bruke variabler

Nå som du har fått infrastrukturen til å fungere med hardkodet bucket-navn, skal vi gjøre konfigurasjonen mer fleksibel ved å introdusere variabler.

1. **Legg til en variabel for bucket-navnet** øverst i `main.tf`:

```hcl
variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}
```

2. **Erstatt det hardkodede bucket-navnet** i S3 bucket-ressursen:

```hcl
resource "aws_s3_bucket" "website" {
  bucket = var.bucket_name  # Endret fra hardkodet verdi
}
```

3. **Apply endringene** med variabelen:

```bash
terraform apply -var 'bucket_name=ditt_bucket_navn'
```

Terraform vil nå vise at det ikke er nødvendig med endringer, siden bucket-navnet er det samme.

**Fordelen med variabler**: Du kan nå enkelt endre bucket-navnet uten å redigere koden, og gjenbruke samme konfigurasjon for flere miljøer.

### Steg 9: Bruk default-verdier for variabler

I stedet for å måtte oppgi verdier på kommandolinjen hver gang, kan du sette default-verdier for variabler. Dette gjør det enklere å jobbe med Terraform i daglig bruk.

1. **Oppdater variabelen med en default-verdi**:

```hcl
variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
  default     = "ditt-bucket-navn"  # Erstatt med ditt eget unike navn
}
```

2. **Apply uten å spesifisere variabel**:

```bash
terraform apply
```

Terraform vil nå bruke default-verdien uten at du må oppgi den på kommandolinjen.

**Best practice**: Bruk default-verdier for variabler som sjelden endres, men la kritiske verdier (som bucket-navn i produksjon) være uten default for å sikre at de blir eksplisitt satt.

### Bonusoppgave: Modifiser nettsiden

Prøv å endre HTML- og CSS-filene i `s3_demo_website`-mappen, og kjør sync-kommandoen på nytt for å se endringene:

```bash
  aws s3 sync s3_demo_website/dist s3://unikt-bucket-navn
```

## Oppsummering

Du har nå deployet og håndtert en statisk nettside på AWS ved hjelp av Terraform og AWS CLI.

## Neste steg

Når denne delen er på plass, fortsetter du med modulene, remote state og CI/CD-pipelinen i oppfølgeren:
[glennbechdevops/modules-remote-state](https://github.com/glennbechdevops/modules-remote-state).
