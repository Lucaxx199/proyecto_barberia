document.addEventListener('DOMContentLoaded', () => {
  const seleccionBarberos = document.getElementById('seleccion-barberos');
  const panelCitas = document.getElementById('panel-citas');
  const listaCitas = document.getElementById('lista-citas');
  const infoCitaDiv = document.getElementById('info-cita');
  const nombreBarberoSpan = document.getElementById('nombre-barbero');
  const btnVolver = document.getElementById('btn-volver');

  // Agrega celular y correo en cada cita para que se pueda usar en el mensaje
  const citas = [
    { id: 'c1', cliente: 'Carlos Méndez', fecha: '2025-06-10', hora: '15:00', estado: 'Pendiente', barberoId: '1', celular: '+56912345678', correo: 'carlos@email.com' },
    { id: 'c2', cliente: 'Ana Gómez', fecha: '2025-06-11', hora: '10:00', estado: 'Pendiente', barberoId: '2', celular: '+56987654321', correo: 'ana@email.com' },
    { id: 'c3', cliente: 'Luis Fernández', fecha: '2025-06-12', hora: '13:00', estado: 'Pendiente', barberoId: '3', celular: '+56911223344', correo: 'luis@email.com' }
  ];

  document.querySelectorAll('.btn-ver-citas').forEach(btn => {
    btn.addEventListener('click', e => {
      const barberoDiv = e.target.closest('.barbero');
      const barberoId = barberoDiv.dataset.id;
      const barberoNombre = barberoDiv.dataset.nombre;

      nombreBarberoSpan.textContent = barberoNombre;
      mostrarCitas(barberoId);

      seleccionBarberos.classList.add('oculto');
      panelCitas.classList.remove('oculto');
    });
  });

  btnVolver.addEventListener('click', () => {
    panelCitas.classList.add('oculto');
    seleccionBarberos.classList.remove('oculto');
    listaCitas.innerHTML = '';
    infoCitaDiv.innerHTML = '';
  });

  function mostrarCitas(barberoId) {
    const citasFiltradas = citas.filter(c => c.barberoId === barberoId && c.estado === 'Pendiente');
    listaCitas.innerHTML = '';

    if (citasFiltradas.length === 0) {
      listaCitas.innerHTML = '<li>No tienes citas pendientes.</li>';
      return;
    }

    citasFiltradas.forEach(cita => {
      const li = document.createElement('li');
      li.textContent = `${cita.fecha} a las ${cita.hora} - Cliente: ${cita.cliente}`;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => mostrarDetalleCita(cita));
      listaCitas.appendChild(li);
    });
  }

  function mostrarDetalleCita(cita) {
    infoCitaDiv.innerHTML = `
      <p><strong>Cliente:</strong> ${cita.cliente}</p>
      <p><strong>Fecha:</strong> ${cita.fecha}</p>
      <p><strong>Hora:</strong> ${cita.hora}</p>
      <p><strong>Estado:</strong> ${cita.estado}</p>
      <div style="margin-top:20px;">
        <button id="btn-confirmar" style="margin-right:10px;padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:8px;cursor:pointer;">Confirmar</button>
        <button id="btn-cancelar" style="padding:10px 20px;background:#f44336;color:white;border:none;border-radius:8px;cursor:pointer;">Cancelar</button>
      </div>
    `;

    document.getElementById('btn-confirmar').addEventListener('click', () => actualizarEstadoCita(cita.id, 'Confirmada', cita));
    document.getElementById('btn-cancelar').addEventListener('click', () => actualizarEstadoCita(cita.id, 'Cancelada', cita));
  }

  function actualizarEstadoCita(id, nuevoEstado, cita) {
    const index = citas.findIndex(c => c.id === id);
    if (index === -1) return;

    citas[index].estado = nuevoEstado;
    alert(`Cita ${nuevoEstado.toLowerCase()}.`);

    const mensaje = encodeURIComponent(
      `Hola ${cita.cliente},\n` +
      `Tu cita con ${nombreBarberoSpan.textContent} para el día ${cita.fecha} a las ${cita.hora} ha sido *${nuevoEstado}*.\n` +
      `Número de celular: ${cita.celular}\n` +
      `Correo electrónico: ${cita.correo}\n` +
      `¡Gracias!`
    );

    const numero = '56930077799'; // Número fijo para enviar el mensaje
    const urlWhatsapp = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(urlWhatsapp, '_blank');

    mostrarCitas(cita.barberoId);
    infoCitaDiv.innerHTML = '';
  }
});
