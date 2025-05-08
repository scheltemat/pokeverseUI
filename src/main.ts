import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes"; // Assuming you have routes in a separate file

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),     // Provides HttpClient for API calls
    provideRouter(routes),   // Provides routing (if you're using any routes)
    ...appConfig.providers,  // If you have other specific providers in appConfig
  ],
}).catch((err) => console.error(err));
