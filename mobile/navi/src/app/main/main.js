import { Text, TouchableOpacity, View } from 'react-native';

export default function Main({ navigation }) {

    // Funções para ir para as páginas
    function conta() {
        navigation.navigate('Conta')

    }

    function historico() {
        navigation.navigate('Histórico')

    }

    function ajustes() {
        navigation.navigate('Ajustes')

    }

    function ajuda() {
        navigation.navigate('Ajuda')

    }


    return (
        <View >

            <Text>Tela principal</Text>

            {/* Conta */}
            <TouchableOpacity onPress={conta}>
                <Text >Conta</Text>
            </TouchableOpacity>

            {/* Histórico */}
            <TouchableOpacity onPress={historico}>
                <Text >Histórico</Text>
            </TouchableOpacity>

            {/* Ajustes */}
            <TouchableOpacity onPress={ajustes}>
                <Text >Ajustes</Text>
            </TouchableOpacity>

            {/* Ajuda */}
            <TouchableOpacity onPress={ajuda}>
                <Text >Ajuda</Text>
            </TouchableOpacity>

        </View>
    );
}