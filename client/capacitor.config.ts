import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "io.ionic.avis",
    appName: "Avis",
    webDir: "dist",
    bundledWebRuntime: false,
    plugins: {
        FirebaseAuthentication: {
            skipNativeAuth: false,
            providers: ["google.com"],
        },
    },
};

export default config;
