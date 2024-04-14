
# About this project
☀️  🌙  ☁  🌟
Listart was built for HackKU 2024. 

## What it does

The idea is 
- list art
- tap art
- buy art
- browse art

> Listart is a **decentralized marketplace** where artists can create upload a digital representation of their art work (image, description, etc.), and embed an NFC tag in the physical version of the art. 

They can tokenize their digital version by minting as an NFT on XRPL, and unique public listing is created for them at a shareable link. They can then embed this link into an NFC tag, and anyone can tap it to view and buy their art. 

☀️  🌙  ☁  🌟
## Inspiration
I'm an art student, specializing in traditional, physical media. I'm also really passionate about decentralization and tokenization that empowers people. 

Earlier this week, I found myself sitting on my bedroom floor for 8 hours, turning 20 paper lanterns and a bag of pillow stuffing into 6 huge, color-changing clouds that hung from the ceiling at HackKU. At some point during those 8 hours, I thought "wow I cannot wait to get rid of these and literally never look at them again."

And then I thought of a HackKU project idea!

>While decentralized marketplaces have been built for digital-native art, no one's designing tokenization platforms _just for_ for art in the real world. 

I care about art, crypto, and convenience. I believe that artists should receive royalties when their work is resold, and they should have convenient ways to sell their work other than showing in galleries (and having to give galleries, like 40% of whatever they make💔).

☀️  🌙  ☁  🌟
## How I built it
I developed ListArt using:
- **XRPL**: To handle the minting of NFTs and manage transactions securely.
- **NFC Tags**: For easy access to artwork details through a simple tap.
- **IPFS**: To store artwork metadata securely on a decentralized file system.
- **React.js/Next.js/Javascript**: For a dynamic front-end.
- **Chakra-UI**: For aesthetic UI in a time-crunch.
- **Xumm**: An XRPL wallet for authentication and signing transactions.

☀️  🌙  ☁  🌟
## Challenges I ran into

- **NFCs**: Apple doesn't allow any sort of NFC programming in the browser, so I would have had to make an app for NFC programming to be native to the site. Instead, I created a super detailed walk-through tutorial on the site for how to embed the URLS in NFCs with an app. 

- **Blockchain**: I also started this project on the XRPL EVM Sidechain using smart contracts, before switching to XRPL about halfway through, since I learned that was a better fit for what I needed to do.

- **Wallets**: It was difficult to figure out the Xumm wallet interactions since it takes 80-90 trillion years to set up. Sadly, in the end, I hit my rate limit with the Xumm API and was forced to set implementing full on-chain functionality aside. 😔🙏🏼

☀️  🌙  ☁  🌟
## Accomplishments that I'm proud of
I'm proud of this idea and how it integrates multiple things I really care about: **art**, **decentralization**, **sharing**, & **digital ownership**. 

> Most of all, I'm also proud of how much I was able to accomplish as a solo hacker.
I didn't finish everything I wanted to, but I hit most of my primary goals: transactions on XRPL, simple but cool UI, everything deployed and shareable.

☀️  🌙  ☁  🌟
## What I learned
I learned a lot about non-EVM blockchain development. I definitely challenged myself with the XRPL/Xumm side of things, but it paid off with how much I learned. I got more experience with IPFS and React, which was really great. In addition to the technical skills I gained, I learned a lot conceptually through the design and planning process. 
> Most of all, working solo and being responsible for the full-stack was a very growing and worthwhile experience. 

☀️  🌙  ☁  🌟
## What's next for ListArt
Moving forward, I plan to:
- **Fully Implement Blockchain Things** including buying, selling, sorting, and browsing.
- **Account Abstraction**, so that no one _has to_ have a Xumm wallet, though they can if they want.
- **An App Version?** or some other workaround to the NFC tag browser programming barrier.
- **Accessibility**: I want to make it so easy that my 75-year old art teacher who hates technology can use it and not hate it. 
> Most of all, **Complete it** enough so that I can use it in my own solo show later in 2024.

