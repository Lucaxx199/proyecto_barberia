let barberoSeleccionado = '';

function mostrarFormulario(nombreBarbero) {
  barberoSeleccionado = nombreBarbero;
  document.getElementById('nombre-barbero').textContent = nombreBarbero;
  document.getElementById('formulario').classList.remove('oculto');
  document.getElementById('formulario').classList.add('visible');
  document.getElementById('form-agenda').reset();
  document.getElementById('hora').innerHTML = '<option value="">Selecciona una hora...</option>';
}

// Función que genera las horas válidas: cada 60 min, entre 9:30 y 18:30, excluyendo 13:00 a 14:00
function generarHorasDisponibles() {
  const horas = [];
  let hora = 9;
  let minutos = 30;

  while (hora < 18 || (hora === 18 && minutos <= 30)) {
    const horaStr = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

    if (!(hora === 13)) { // excluir de 13:00 a 13:59
      horas.push(horaStr);
    }

    hora += 1;
    minutos = 30; // Siempre volver a 30 minutos para respetar el patrón 9:30, 10:30, etc.
  }

  return horas;
}

document.getElementById('fecha').addEventListener('change', function () {
  const fecha = this.value;
  const horaSelect = document.getElementById('hora');
  horaSelect.innerHTML = '<option value="">Selecciona una hora...</option>';

  if (!barberoSeleccionado || !fecha) return;

  const reservas = JSON.parse(localStorage.getItem(barberoSeleccionado)) || [];
  const ocupadas = reservas
    .filter(r => r.fecha === fecha)
    .map(r => r.hora);

  const horas = generarHorasDisponibles();
  horas.forEach(h => {
    const option = document.createElement('option');
    option.value = h;
    option.textContent = h;
    if (ocupadas.includes(h)) {
      option.disabled = true;
      option.textContent += ' (Ocupado)';
    }
    horaSelect.appendChild(option);
  });
});

// document.getElementById('form-agenda').addEventListener('submit', function (e) {
//   e.preventDefault();

//   const nombre = document.getElementById('nombre').value.trim();
//   const correo = document.getElementById('correo').value.trim();
//   const telefono = document.getElementById('telefono').value.trim();
//   const fecha = document.getElementById('fecha').value;
//   const hora = document.getElementById('hora').value;

//   if (!nombre || !correo || !telefono || !fecha || !hora || !barberoSeleccionado) {
//     alert('Por favor completa todos los campos.');
//     return;
//   }

//   const nuevaReserva = {
//     nombre,
//     correo,
//     telefono,
//     fecha,
//     hora
//   };

//   let reservas = JSON.parse(localStorage.getItem(barberoSeleccionado)) || [];

//   const yaReservado = reservas.some(r => r.fecha === fecha && r.hora === hora);
//   if (yaReservado) {
//     alert(`La hora ${hora} ya está reservada para el ${fecha} con ${barberoSeleccionado}. Elige otra.`);
//     return;
//   }

//   reservas.push(nuevaReserva);
//   localStorage.setItem(barberoSeleccionado, JSON.stringify(reservas));

//   alert(`Reserva confirmada con ${barberoSeleccionado} el ${fecha} a las ${hora}.`);
//   document.getElementById('form-agenda').reset();
//   document.getElementById('formulario').classList.add('oculto');
//   document.getElementById('formulario').classList.remove('visible');
// });


document.getElementById('form-agenda').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const telefono = document.getElementById('telefono').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;

  const nuevaReserva = {
    barbero: barberoSeleccionado,
    nombre,
    correo,
    telefono,
    fecha,
    hora
  };

  // Guardar por barbero en localStorage
  const reservas = JSON.parse(localStorage.getItem(barberoSeleccionado)) || [];
  reservas.push(nuevaReserva);
  localStorage.setItem(barberoSeleccionado, JSON.stringify(reservas));

  alert('Reserva confirmada para ' + barberoSeleccionado + ' el ' + fecha + ' a las ' + hora);

  // Resetear formulario y ocultarlo si deseas
  document.getElementById('form-agenda').reset();
  document.getElementById('formulario').classList.add('oculto');
});
