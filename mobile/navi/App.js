//Importando bibliotecas
import { NavigationContainer } from "@react-navigation/native";

//Provider
import { LoginProvider } from "./src/providers/loginProvider.js";

//Importando as rotas
import AppNavigator from "./navigation.js";



export default function App() {
  return (
    <>
      <LoginProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LoginProvider>
    </>
  );
}
