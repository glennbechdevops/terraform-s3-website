# 🍹 Crypto Juice Exchange - Terraform + React Demo

> **Original Lab**: This repo was adapted from a Terraform S3 website hosting lab. The Norwegian lab instructions have been preserved below.

A stunning demonstration of Infrastructure as Code (IaC) using **Terraform** to deploy a modern **React** application to **AWS S3**. This project showcases real-time cryptocurrency data, interactive charts, live news, and beautiful animations.

## 🚀 What Makes This Special

- 📊 **LIVE DATA** - Real cryptocurrency prices from CoinGecko API (updates every 30 seconds)
- 📈 **Interactive Charts** - Beautiful price history visualizations with Recharts
- 📰 **Live News Feed** - Latest crypto news from CryptoCompare API
- 🌍 **Global Market Stats** - Market cap, volume, and dominance with animated charts
- 💼 **Mock Portfolio** - Track your investments with P&L calculations
- ✨ **Smooth Animations** - Framer Motion throughout for that "wow" factor
- 🎨 **Modern Design** - Dark theme with neon accents and glass-morphism effects

## 🛠️ Quick Start

### 1. Build the React App

```bash
cd s3_demo_website
npm install
npm run build
cd ..
```

### 2. Deploy with Terraform

```bash
terraform init
terraform apply
```

### 3. Access Your Site

After deployment, Terraform outputs the URL:

```
s3_website_url = "http://glenn-sin-web-buckett.s3-website.eu-west-1.amazonaws.com"
```

## 🎓 For Students - Key Learning Points

### What This Demo Teaches

1. **Real Infrastructure as Code**
   - Terraform manages AWS resources declaratively
   - Same code = same infrastructure every time
   - Version controlled infrastructure

2. **Modern Web Development**
   - React with TypeScript for type safety
   - API integration with real-time data
   - State management with React Query
   - Performance optimization

3. **Cloud Architecture**
   - S3 static website hosting (pennies per month!)
   - Proper IAM policies for security
   - MIME type handling for browsers
   - Content-based change detection

4. **Professional Practices**
   - Organized project structure
   - Comprehensive documentation
   - Error handling and loading states
   - Responsive design

### Tech Stack

**Frontend:**
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- ✨ Framer Motion (animations)
- 📊 Recharts (charts)
- 🔄 React Query (data fetching)
- ⚡ Vite (build tool)

**Infrastructure:**
- 🏗️ Terraform
- ☁️ AWS S3
- 🔒 IAM Policies

**APIs:**
- 🪙 CoinGecko - Crypto prices & market data
- 📰 CryptoCompare - News feed

## 📋 Project Structure

```
s3_demo_website/
├── src/
│   ├── components/          # React components
│   │   ├── PriceCard.tsx    # Live price cards
│   │   ├── PriceChart.tsx   # Interactive charts
│   │   ├── NewsCard.tsx     # News feed
│   │   ├── Portfolio.tsx    # Portfolio tracker
│   │   └── MarketStats.tsx  # Market overview
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API integration
│   ├── types/               # TypeScript types
│   └── App.tsx              # Main app
├── dist/                    # Build output (created by npm run build)
└── package.json
```

## 🎯 Terraform Highlights

The `main.tf` demonstrates:

1. **Local Variables** - Centralized configuration
2. **Resource Management** - S3 bucket, website config, policies
3. **For Each Loops** - Dynamic file uploads with `fileset()`
4. **Data Sources** - Current AWS region
5. **Functions** - `filemd5()`, `regex()`, `lookup()`
6. **Outputs** - Website URL and deployment info
7. **Dependencies** - Proper resource ordering

## 🔧 Development

### Run Locally

```bash
cd s3_demo_website
npm run dev
```

Opens at `http://localhost:5173` with hot reload.

### Build for Production

```bash
npm run build
```

Creates optimized bundle in `dist/`.

## 🎨 Features Walkthrough

### Live Prices Tab
- Real-time crypto prices for 6 major coins
- 24h price changes with trending indicators
- Market cap and volume data
- "Add to Stack" button for portfolio tracking
- Smooth hover animations

### Charts Tab
- Select any cryptocurrency
- Historical price data (24h, 7d, 30d, 1y)
- Interactive tooltips
- Animated area charts
- Color-coded by crypto

### News Tab
- Latest crypto news articles
- Article images and metadata
- Time ago formatting
- External links to full articles
- Category tags

### Portfolio Tab
- Track your crypto investments
- Shows current value vs cost basis
- P&L calculation with percentages
- Stored in browser localStorage
- Remove holdings easily

### Global Market Stats
- Total market capitalization
- 24h trading volume
- Number of active cryptocurrencies
- Market dominance pie chart (BTC, ETH, Others)
- Live data indicator

## 💡 Try These Exercises

1. **Add a new crypto** - Edit `CRYPTO_BEVERAGES` in `src/types/crypto.ts`
2. **Change colors** - Modify Tailwind config in `tailwind.config.js`
3. **Add CloudFront** - Implement HTTPS and CDN in Terraform
4. **Custom domain** - Use Route53 for a real domain name
5. **CI/CD Pipeline** - Automate builds and deployments with GitHub Actions

## 🌟 Why This Impresses Students

1. **It's LIVE!** - Not mocked data, actual cryptocurrency prices updating in real-time
2. **Beautiful animations** - Smooth transitions and micro-interactions throughout
3. **Professional quality** - Looks like a real production application
4. **Real-world relevant** - Crypto is something students know and care about
5. **Complete workflow** - From code to deployed website in minutes
6. **Cost effective** - Entire setup costs pennies per month on AWS

## 📚 Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS S3 Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [React Documentation](https://react.dev)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

---

# 🇳🇴 Original Lab Instructions (Norwegian)

## Mål
Deploy en statisk nettside på AWS S3 ved hjelp av Terraform. Denne øvelsen dekker bruk av moduler fra Terraform Registry, håndtering av ressurser med AWS CLI, samt bruk av variabler og outputs i Terraform.

## Forberedelser

### Steg 0: Opprett GitHub Codespace fra din fork

1. **Fork dette repositoriet** til din egen GitHub-konto
2. **Åpne Codespace**: Klikk på "Code" → "Codespaces" → "Create codespace on main"
3. **Vent på at Codespace starter**: Dette kan ta et par minutter første gang
4. **Terminalvindu**: Du vil utføre de fleste kommandoer i terminalen som åpner seg nederst i Codespace
5. **AWS Credentials**. Kjør `aws configure` og legg inn AWS aksessnøkler. 


### Steg 1: Verifiser miljøet

Repositoriet er allerede klonet i ditt Codespace. Verifiser at du er i riktig mappe:

```bash
pwd
ls
```

Du skal se filene fra dette repositoriet, inkludert mappen `s3_demo_website`. 

### Steg 2: Opprett Terraform-konfigurasjon

Nå skal du bygge opp Terraform-konfigurasjonen fra bunnen av. Du vil lære om de ulike AWS S3-ressursene som trengs for å hoste en statisk nettside.

1. **Opprett `main.tf`** i rotmappen av prosjektet

2. **Opprett S3 bucket-ressursen** med et hardkodet bucket-navn (erstatt `<unikt-bucket-navn>` med ditt eget unike navn, f.eks. dine initialer eller studentnummer):
Det er ganske strenge regler for navn for buckets! https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html

```hcl
resource "aws_s3_bucket" "website" {
  bucket = "unikt-bucket-navn"
}
```

3. **Konfigurer S3 bucket for website hosting**:

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

4. **Åpne bucketen for offentlig tilgang** (nødvendig for static websites):

```hcl
resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
```

5. **Legg til en bucket policy som tillater offentlig lesing**:

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

6. **Legg til en output for å få URL-en til nettsiden**:

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

**Merk**: Hvis du får en feilmelding om `AccessDenied` ved `PutBucketPolicy`, prøv kommandoen på nytt. Spør instruktør hvis du er nysgjerrig på hvorfor dette skjer.
**Viktig**: Pass på at du ikke får feilneldinger etter apply før du går videre.

### Steg 4: Last opp filer til S3


Bruk AWS CLI for å laste opp nettsidefilene til S3 bucketen:

```bash
aws s3 sync s3_demo_website s3://unikt-bucket-navn
```

### Steg 5: Inspiser bucketen i AWS Console

Gå til AWS Console, og tjenesten S3, og se på objekter og bucket-egenskaper for å forstå hvordan alt er satt opp.

### Steg 6: Åpne nettsiden

Hent URL-en til nettsiden:

```bash
terraform output s3_website_url
```

Åpne URL-en i nettleseren for å se din statiske nettside.

### Steg 7: Refaktorer til å bruke variabler

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

### Steg 8: Bruk default-verdier for variabler

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
aws s3 sync s3_demo_website s3://unikt-bucket-navn
```

## Oppsummering

Du har nå deployet og håndtert en statisk nettside på AWS ved hjelp av Terraform og AWS CLI.
