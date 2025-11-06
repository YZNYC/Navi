// src/app/account/account.js
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLogin } from '../../providers/loginProvider';
import { LoginForm } from './loginForm';
import { Link } from 'expo-router';

export default function Account() {
  const { user } = useLogin();
  if (user) {
    return <UserProfile user={user} />;
  }

  return <LoginForm />;
}

// TELA DO PERFIL (quando tá logado)
const UserProfile = ({ user }) => {
  const { setUser } = useLogin();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que quer sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            setUser(null); // remove o usuário
            Alert.alert("Tchau!", "Você saiu da conta.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.url_foto_perfil || 'https://i.pravatar.cc/150?img=1' }}
        style={styles.avatar}
      />
      <Text style={styles.nome}>{user.nome}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.papel}>Papel: {user.papel}</Text>
      {user.telefone && <Text style={styles.info}>Tel: {user.telefone}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Sair da conta</Text>
      </TouchableOpacity>

      <Link href="/register" style={styles.link}>
        Criar outra conta
      </Link>
    </View>
  );
};

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  nome: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#555', marginTop: 5 },
  papel: { fontSize: 16, color: '#FFDE33', fontWeight: 'bold', marginTop: 10 },
  info: { fontSize: 14, color: '#777', marginTop: 5 },
  btn: {
    backgroundColor: '#FF4444',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    width: '80%',
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { marginTop: 20, color: '#0066cc' },
});