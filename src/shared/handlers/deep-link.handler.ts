import * as Linking from "expo-linking";

export const handleDeepLink = (event) => {
    console.log("handleDeepLink", event);
    let data = Linking.parse(event.uri)

    console.log(data);
}
