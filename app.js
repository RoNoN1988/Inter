// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

// Tu configuración Firebase (la que me pasaste)
const firebaseConfig = {
  apiKey: "AIzaSyDBVo88SrMiD_E3dDnsTxx7l_2qldns0Ik",
  authDomain: "saludos-de-cumple.firebaseapp.com",
  projectId: "saludos-de-cumple",
  storageBucket: "saludos-de-cumple.appspot.com",
  messagingSenderId: "343976992588",
  appId: "1:343976992588:web:991675070e9a234b87f9e9",
  measurementId: "G-XHGQXJFQER"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Subir saludo
window.enviarSaludo = async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const foto = document.getElementById('foto').files[0];

  if (!nombre || !mensaje || !foto) {
    alert('Por favor completá todos los campos.');
    return;
  }

  const storageRef = ref(storage, 'saludos/' + Date.now() + '_' + foto.name);
  await uploadBytes(storageRef, foto);
  const fotoURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'saludos'), {
    nombre,
    mensaje,
    fotoURL,
    fecha: new Date()
  });

  alert('✅ ¡Tu saludo fue enviado!');
  document.getElementById('nombre').value = '';
  document.getElementById('mensaje').value = '';
  document.getElementById('foto').value = '';
  cargarSaludos();
};

// Mostrar saludos
async function cargarSaludos() {
  const container = document.getElementById('saludosContainer');
  container.innerHTML = '';
  const q = query(collection(db, 'saludos'), orderBy('fecha', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement('div');
    div.className = 'media';
    div.innerHTML = `
      <p><strong>${data.nombre}</strong></p>
      <p>${data.mensaje}</p>
      <img src="${data.fotoURL}" alt="Saludo de ${data.nombre}" />
    `;
    container.appendChild(div);
  });
}

cargarSaludos();
