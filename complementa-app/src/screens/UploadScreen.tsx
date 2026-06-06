// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
// import Footer from '../components/Footer';

// // Importa a função que o seu colega criou
// import { createSubmission } from '../services/firebaseRepository';

// export default function UploadScreen() {
//   // Estados para os dados do formulário que o banco exige
//   const [titulo, setTitulo] = useState<string>('');
//   const [categoria, setCategoria] = useState<string>('');
//   const [horas, setHoras] = useState<string>('');

//   // Estados para o arquivo
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [fileUri, setFileUri] = useState<string | null>(null);
//   const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);
  
//   const [isUploading, setIsUploading] = useState<boolean>(false);

//   const handlePickFile = async (): Promise<void> => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['application/pdf', 'image/png'], 
//         copyToCacheDirectory: true,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const file = result.assets[0];
//         setFileName(file.name);
//         setFileUri(file.uri);
//         setFileMimeType(file.mimeType); // Salva o tipo (ex: 'application/pdf')
//       }
//     } catch (error) {
//       Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o arquivo.");
//     }
//   };

//   const handleSubmit = async (): Promise<void> => {
//     // Validação de todos os campos que o backend exige
//     if (!titulo || !categoria || !horas || !fileUri) {
//       Alert.alert("Atenção", "Por favor, preencha todos os campos e selecione um arquivo.");
//       return;
//     }

//     try {
//       setIsUploading(true);

//       // ATENÇÃO: Para chamar o createSubmission, você precisa do usuário logado.
//       // Como estamos testando, você pode precisar pegar esse usuário do seu sistema de Login (Contexto/Zustand/Redux).
//       // Aqui estou criando um "mock" (usuário falso) apenas para o Typescript não reclamar, 
//       // MAS VOCÊ DEVE SUBSTITUIR ISSO PELO USUÁRIO REAL QUE VEM DO SEU LOGIN.
//       const usuarioLogado: any = {
//         token: 'TOKEN_DO_USUARIO_AQUI', // O backend precisa do token real para autorizar
//         nome: 'Aluno Teste',
//       };

//       // Chama a função do arquivo firebaseRepository.ts
//       const respostaDoServidor = await createSubmission(usuarioLogado, {
//         titulo: titulo,
//         categoria: categoria,
//         horas: Number(horas), // Converte o texto digitado para número
//         file: {
//           uri: fileUri,
//           name: fileName!,
//           mimeType: fileMimeType,
//         }
//       });

//       // Pede para o alerta mostrar a URL que o servidor gerou
//       Alert.alert(
//         "Sucesso!", 
//         `Atividade salva!\nLink gerado: ${respostaDoServidor.urlCertificado || 'NENHUM LINK RETORNADO'}`
//       );
//       // Alert.alert("Sucesso!", "A atividade foi enviada e salva no banco de dados.");
      
//       // Limpa a tela após o sucesso
//       setTitulo('');
//       setCategoria('');
//       setHoras('');
//       setFileName(null);
//       setFileUri(null);

//     } catch (error: any) {
//       console.error(error);
//       Alert.alert("Erro no Envio", error.message || "Não foi possível enviar para o servidor.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Footer />

//       {/* Usamos KeyboardAvoidingView e ScrollView porque agora temos campos de digitar */}
//       <KeyboardAvoidingView 
//         style={{ flex: 1 }} 
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={styles.title}>Nova Atividade</Text>
//           <Text style={styles.subtitle}>Preencha os dados e anexe o comprovante.</Text>

//           {/* Novos Campos de Texto */}
//           <TextInput
//             style={styles.input}
//             placeholder="Título da Atividade"
//             value={titulo}
//             onChangeText={setTitulo}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Categoria (ex: Extensão, Pesquisa)"
//             value={categoria}
//             onChangeText={setCategoria}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Carga Horária (Apenas números)"
//             keyboardType="numeric"
//             value={horas}
//             onChangeText={setHoras}
//           />

//           <View style={styles.fileBox}>
//             {fileName ? (
//               <Text style={styles.fileName}>{fileName}</Text>
//             ) : (
//               <Text style={styles.placeholderText}>Nenhum arquivo selecionado</Text>
//             )}
//           </View>

//           <TouchableOpacity 
//             style={styles.pickButton} 
//             onPress={handlePickFile}
//             disabled={isUploading}
//           >
//             <Text style={styles.pickButtonText}>Escolher Arquivo</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.submitButton, (!fileUri || isUploading) && styles.submitButtonDisabled]} 
//             onPress={handleSubmit}
//             disabled={!fileUri || isUploading} 
//           >
//             {isUploading ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <Text style={styles.submitButtonText}>Enviar Atividade</Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F7F9FC' },
//   content: { padding: 24, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', color: '#2D3748', marginBottom: 8, textAlign: 'center' },
//   subtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 24 },
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#2D3748',
//     marginBottom: 16,
//   },
//   fileBox: { backgroundColor: '#EDF2F7', borderWidth: 1, borderColor: '#CBD5E0', borderStyle: 'dashed', borderRadius: 8, padding: 24, alignItems: 'center', marginBottom: 24 },
//   fileName: { fontSize: 16, color: '#2B6CB0', fontWeight: '600', textAlign: 'center' },
//   placeholderText: { fontSize: 16, color: '#A0AEC0' },
//   pickButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#2B6CB0', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
//   pickButtonText: { color: '#2B6CB0', fontSize: 16, fontWeight: 'bold' },
//   submitButton: { backgroundColor: '#2B6CB0', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
//   submitButtonDisabled: { backgroundColor: '#A0AEC0' },
//   submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
// });



















// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// // Importação da biblioteca que acabamos de instalar
// import * as DocumentPicker from 'expo-document-picker';

// /* Import do "Cabeçario" de navegação */
// import Footer from '../components/Footer';

// export default function UploadScreen() {
//   // Estados para guardar o nome e o caminho do arquivo selecionado
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [fileUri, setFileUri] = useState<string | null>(null);

//   // Função para abrir o gerenciador de arquivos
//   const handlePickFile = async (): Promise<void> => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         // Tipos MIME permitidos (PDF e PNG)
//         type: ['application/pdf', 'image/png'], 
//         copyToCacheDirectory: true,
//       });

//       // Se o usuário não cancelou e selecionou um arquivo
//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const file = result.assets[0];
//         setFileName(file.name);
//         setFileUri(file.uri); // O URI é o que você vai usar para enviar para o backend depois
//       }
//     } catch (error) {
//       Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o arquivo.");
//     }
//   };

//   // Função para simular o envio do arquivo
//   const handleSubmit = (): void => {
//     if (!fileUri) {
//       Alert.alert("Atenção", "Por favor, selecione um arquivo antes de enviar.");
//       return;
//     }

//     // Aqui entraria o código para enviar o arquivo via API (FormData)
//     Alert.alert("Enviando...", `O arquivo "${fileName}" seria enviado agora.`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Envio de Atividade</Text>
//       <Text style={styles.subtitle}>
//         Selecione um arquivo PDF ou uma imagem PNG para continuar.
//       </Text>

//       {/* Caixa de exibição do arquivo selecionado */}
//       <View style={styles.fileBox}>
//         {fileName ? (
//           <Text style={styles.fileName}>{fileName}</Text>
//         ) : (
//           <Text style={styles.placeholderText}>Nenhum arquivo selecionado</Text>
//         )}
//       </View>

//       <TouchableOpacity 
//         style={styles.pickButton} 
//         onPress={handlePickFile}
//       >
//         <Text style={styles.pickButtonText}>Escolher Arquivo</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[styles.submitButton, !fileUri && styles.submitButtonDisabled]} 
//         onPress={handleSubmit}
//         disabled={!fileUri} // Desabilita o botão se não houver arquivo
//       >
//         <Text style={styles.submitButtonText}>Enviar Arquivo</Text>
//       </TouchableOpacity>

//     <View style={styles.restoDaTela}>
//     </View>

//       <Footer />

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F9FC',
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2D3748',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#718096',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   fileBox: {
//     backgroundColor: '#EDF2F7',
//     borderWidth: 1,
//     borderColor: '#CBD5E0',
//     borderStyle: 'dashed',
//     borderRadius: 8,
//     padding: 24,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   fileName: {
//     fontSize: 16,
//     color: '#2B6CB0',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#A0AEC0',
//   },
//   pickButton: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#2B6CB0',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   pickButtonText: {
//     color: '#2B6CB0',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   submitButton: {
//     backgroundColor: '#2B6CB0',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#A0AEC0',
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   /////// obs: resto de tela /////////
//     restoDaTela: {
//     flex: 0,
//     padding: 8,
//   }
// });