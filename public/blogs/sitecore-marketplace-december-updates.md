# Sitecore Marketplace Updates (December 2025)

Sitecore team just announced some huge updates for the Marketplace.

## Blok Design System reaches General Availability (GA) 

Sitecore is thrilled to announce that new [Blok](https://blok.sitecore.com/) design system based on Tailwind and Shadcn has officially moved out of Beta and reached General Availability!

This milestone makes Blok the recommended and future-proof approach for building Sitecore Marketplace interfaces and AI-driven experiences. From now on, Blok is the way forward for all new projects and UI modernization efforts when building apps which should look and behave like Sitecore.

### Features

- Updated home page: `shadcn/ui` is not the default way to start
- [Primitives](https://blok.sitecore.com/primitives) section contains all available components together with code (which you can easily copy-paste into your app)
- [MCP Server](https://blok.sitecore.com/mcp) - use [shadcn MCP Server](https://ui.shadcn.com/docs/mcp) directly with Sitecore Blok Registry

### Why GA matters
- **Production ready** - Blok is now ready for production use
- **Consistent, scalable design language** - Blok provides a consistent, scalable design language that can be used across all Sitecore Marketplace apps
- **Enhanced developer experience** - Blok provides a rich set of tools and features to help developers build and maintain their apps

_Bonus_. If you are just starting to build a new app, you can use [Quick start (CLI)](https://doc.sitecore.com/mp/en/developers/sdk/0/sitecore-marketplace-sdk/quick-start--cli-.html) to scaffold your app, so Blok will be already included, e.g.:
```sh
npx shadcn@latest add https://blok.sitecore.com/r/marketplace/next/quickstart.json
```

Read more in the [changelog](https://developers.sitecore.com/changelog/sitecoreai/05122025/blok-design-system-reaches-general-availablity-(ga))

## App Permissions and New Event Subscriptions

Permissions
- Opening pop-ups and in-app links. (e.g. open link with `target="_blank"`)
- Copy content to the user's clipboard. (using `navigator.clipboard.writeText`)
- Reading content from the user's clipboard. (using `navigator.clipboard.readText`)

### Apply New Permissions (for existing apps)

Ensure you update **Permissions** in the **App Studio**.

![permissions](/images/2025/marketplace-updates/app-permissions.png)

After that you need to **update** your app in the **My Apps** section.

![update](/images/2025/marketplace-updates/update-app.png)

![update confirm](/images/2025/marketplace-updates/update-app-confirm.png)

### Events
[Marketplace SDK Version 0.3.0](https://www.npmjs.com/package/@sitecore-marketplace-sdk/client) lets you subscribe to [page layout](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/subscribe-to-page-layout-changes.html) and [fields changes](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/subscribe-to-field-changes.html). 
It is valid in scope of **Page Builder** extension: you can react to page layout and page fields changes.

Read more in the [changelog](https://developers.sitecore.com/changelog/marketplace/10122025/introducing-marketplace-app-permissions-and-new-event-subscriptions-in-the-sdk)


## Conclusion

These updates represent significant progress in the Marketplace App Development ecosystem. 

With **Blok** now production-ready, featuring clear documentation and comprehensive examples, developers have a solid foundation for building consistent interfaces. 
<br/>Furthermore, the introduction of **App Permissions** demonstrates Sitecore's commitment to security and privacy, while effectively addressing previous technical limitations.
