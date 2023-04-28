# JavaScript with Workday Extend Example

An example that demonstrates building a custom JavaScript UI with the [React](https://create-react-app.dev) framework that brings [Workday Extend](https://developer.workday.com) capabilities to non-Workday systems and applications.

Multiple [App Examples](#app-examples) are contained in this project to demonstrate the art of the possible, built on top of a lightly opinionated scaffolding which you could use as a starter template for a project of your own.

Please note this project is for demonstration and educational purposes, and is not officially supported by Workday as a production-ready application.

[Workday Canvas Kit](https://workday.github.io/canvas-kit) UI components are used to provide Workday look & feel.
[Create React App](https://create-react-app.dev/) is used for managing the project.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en)
- Workday Cloud Platform Developer Account & Developer Tenant ([Workday Extend](https://developer.workday.com) subscription required)

### Setup

1. Clone or fork this repository.
2. Run `npm install` in the project root directory to install dependencies.
3. Create a [Workday Cloud Platform API Client](https://developer.workday.com/console/clients/create) with the following values:
   - **Name**: JavaScript App Example
   - **Redirect URI**: http://localhost:3000/authorize
   - **Authorized CORS Domains**: http://localhost:3000
   - **_Note_**: You will need to add **Scopes** to this API Client later, depending on which App Examples you wish to configure or what Workday API's you will be connecting to for your own project.
4. Modify the `.env` file in project root to set the **REACT_APP_WCP_API_CLIENT_ID** value to the API Client ID created in the previous step (ex. `REACT_APP_WCP_API_CLIENT_ID=ZDMzN...`)
   - _Note_: You can optionally set the **REACT_APP_WCP_DEFAULT_TENANT_ALIAS** value to the WCP tenant alias for the tenant you want to use, enabling users to bypass providing a tenant alias when authenticating.
5. Run `npm start` to launch the app. Your app should become available at `http://localhost:3000`.
6. Authorize the app against your Developer Tenant by clicking **Login** in the app.
7. Optionally, proceed with the instructions for each provided App Example to wish to explore.

### App Examples

#### Spot Bonus

Give a Spot Bonus (One-Time Payment) with Anytime Feedback to your direct reports, using Workday Graph API.

1. Add the following Scopes to your Workday Cloud Platform API Client: `Core Compensation` `Talent Core` `Workday Extend`.
2. In your Development Tenant, enable the `Workday Graph API Applications` **Security Domain Policy** and add **Modify** permissions so users can execute **Workday Graph API** requests.
3. In your Development Tenant, configure the `Request One-Time Payment` **Business Process Security Policy** to add the following permissions:
   - `Request One-Time Payment (REST Service)`
    * **Initiating Action**: `Manager`
4. Run the `Activate Pending Security Policy Changes` task to activate your changes.
5. Explore using the app to create Spot Bonuses for users in your Workday Developer Tenant.

#### Worker Badge Generator

Generate and upload Worker Badge images to Workday, storing data in Application Business Objects. Leverages HTML5 Canvas to create a custom badge image using a source image or webcam capture in conjunction with worker information contained in Workday, such as the Worker's name and location.

1. Add the following Scopes to your Workday Cloud Platform API Client: `Staffing` `Workday Extend`
   Deploy the [Worker Badges App from the App Catalog](https://developer.workday.com/app-catalog/workerBadges) to your Developer Tenant and follow the configuration instructions.
2. Modify the `.env` file in the project root to set the **REACT_APP_EXTEND_APP_REFERENCE_ID_BADGE_GENERATOR** value to your Workday Extend App Reference ID (ex. `REACT_APP_EXTEND_APP_REFERENCE_ID_BADGE_GENERATOR=workerBadges_abcdef`)
3. Stop the server process if it is running (`CTRL+C` or close Terminal window), and run `npm start` to launch the app again.
   - _Note_: Changes to the `.env` file require you to restart the server if it is running in order to take effect.
4. Explore using the app to create Badge Images from file upload and your webcam in your Workday Developer Tenant.

## License

See [LICENSE](LICENSE)

## Support

Questions, comments, bugs? Use the **Site Feedback** widget on https://developer.workday.com, we'd love to hear from you.
