////////// TESTE DE CONEXÃO COM O FIREBASE /////////////



import { db } from './firebase'; // Importe a inicialização do seu Firebase/Firestore
import { collection, getDocs, limit, query } from 'firebase/firestore'; 

async function testFirebaseConnection() {
  try {
    console.log("🔄 Tentando conectar ao Firebase...");
    
    // Tenta buscar apenas 1 documento de qualquer coleção existente (ex: 'usuarios')
    const q = query(collection(db, 'usuarios'), limit(1));
    await getDocs(q);
    
    console.log("✅ Conexão com o Firebase estabelecida com sucesso!");
  } catch (error: any) {
    console.error("❌ Falha na conexão com o Firebase:");
    console.error(`Código do Erro: ${error.code}`);
    console.error(`Mensagem: ${error.message}`);
  }
}

testFirebaseConnection();
