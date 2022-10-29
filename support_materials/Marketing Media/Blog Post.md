Ticket The World is a unique visual alerting system activated by Jira tickets. Lights change when items are created/updated.

Have your lights change colour whenever a new customer ticket is created or alert you when your team closes out an epic — you choose the rules and what services to integrate with.

https://youtu.be/64MGZvgtF98

Project source and implementation documentation is available via github.

The system is straightforward to extend so you can easily swap parts of the pipeline with other tools or add your new integration points as desired.

I created Ticket The World to help me keep an eye on the creation and progress of Jira tickets that I was following. I am the Product Owner for a few agile teams with a global developer base which means that ticket updates could come in at any hour of the day. With Ticket The World I am able to stay informed on ticket progress while working from home. I can easily see when high priority tickets are entered or updated without needing to be tied to my computer.

# Why did you use ‘service x’ instead of another other service?

As with many real-world tasks there are often multiple ways to achieve the same, or similar, results. The choices made here are ones that suited my needs without requiring a large investment in time, money, or resources. You may find that you prefer some services that I chose not to use so please customize and enhance. If you create an integration that others may like please let me know.

I had a Synology NAS at home that is capable of running Python 3 scripts so I used it to poll for tickets. I had also used Netlify for a small personal project previously and was quite impressed with their system so it felt like a good natural fit UPDATE: unfortunately Netlify seems to have a limitation with functions when deployed in prod — they worked fine while developing so I switched to Cloudflare Workers that functioned as needed. Upstash and Redis were new to me but were quick and powerful and were a joy to work with.

# How can users get started with using this project?

This project was built to suit my particular needs so you may wish to customize or adapt the overall project to better suit your requirements. All web application services were kept as low-cost (or free) wherever possible though actual pricing is often based on usage.
