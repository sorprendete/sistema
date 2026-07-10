const fs = require('fs');

const proyectosDim = [
    { oeti: 'OETI 1.1', nombre: 'Auditoría semestral', res: 'Área de Calidad', inicio: '2026-01-01', fin: '2026-06-30' },
    { oeti: 'OETI 1.1', nombre: 'Módulo SGC', res: 'Área de Calidad', inicio: '2026-04-01', fin: '2026-12-31' },
    { oeti: 'OETI 3.1', nombre: 'Reglamento OTI', res: 'Dirección General', inicio: '2026-01-01', fin: '2026-03-31' },
    { oeti: 'OETI 3.1', nombre: 'Dashboard Gerencial', res: 'Jefatura OTI', inicio: '2026-07-01', fin: '2027-03-31' },
    { oeti: 'OETI 2.1', nombre: 'EVA en nube', res: 'Unidad Académica', inicio: '2026-01-01', fin: '2026-09-30' },
    { oeti: 'OETI 2.1', nombre: 'Aulas Híbridas', res: 'Administración', inicio: '2026-04-01', fin: '2027-12-31' },
    { oeti: 'OETI 2.2', nombre: 'Admisión en Línea', res: 'Administración', inicio: '2027-01-01', fin: '2027-09-30' },
    { oeti: 'OETI 3.2', nombre: 'Ciberseguridad', res: 'Jefatura OTI', inicio: '2026-05-01', fin: '2026-11-30' }
];

const estados = ['Cumplido', 'En proceso', 'Riesgo medio', 'Crítico'];

const data = {
    fact_diaria: [],
    portafolioProyectos: [],
    dim_estudiantes: []
};

// Generar portafolioProyectos
proyectosDim.forEach((p, idx) => {
    const estado = estados[Math.floor(Math.random() * estados.length)];
    let avance = 0;
    if (estado === 'Cumplido') avance = 100;
    else if (estado === 'En proceso') avance = Math.floor(Math.random() * 50) + 30;
    else if (estado === 'Riesgo medio') avance = Math.floor(Math.random() * 30) + 10;
    else avance = Math.floor(Math.random() * 20);

    data.portafolioProyectos.push({
        id: idx + 1,
        ...p,
        estado: estado,
        avance: avance
    });
});

// Generar fact table
const startDate = new Date('2026-01-01');
for (let i = 0; i < 2000; i++) {
    const date = new Date(startDate.getTime() + Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000);
    const month = date.getMonth();
    const year = date.getFullYear();
    const trimestre = `Q${Math.floor(month / 3) + 1} ${year}`;
    
    // Asignar a un proyecto aleatorio (vinculado por nombre)
    const proyRef = data.portafolioProyectos[Math.floor(Math.random() * data.portafolioProyectos.length)];

    data.fact_diaria.push({
        id: i,
        fecha: date.toISOString().split('T')[0],
        trimestre: trimestre,
        mes_año: `${date.toLocaleString('default', { month: 'short' })} ${year}`,
        
        // Dimensiones
        proyecto: proyRef.nombre,
        oeti: proyRef.oeti,
        responsable: proyRef.res,
        estado: proyRef.estado,
        
        // Métricas
        avance_peti: Math.floor(Math.random() * 100),
        cumplimiento_cbc: Math.floor(Math.random() * 20) + 80,
        incidentes_ti: Math.floor(Math.random() * 3),
        usuarios_eva: Math.floor(Math.random() * 100) + 350,
        cursos_activos: Math.floor(Math.random() * 5) + 40,
        tramites_digitales: Math.floor(Math.random() * 30) + 20,
        uso_biblioteca: Math.floor(Math.random() * 40) + 40,
        tickets_atendidos: Math.floor(Math.random() * 10) + 1,
        tiempo_respuesta: Math.floor(Math.random() * 12) + 1,
        incidentes_seguridad: Math.floor(Math.random() * 2),
        backups: 1,
        disponibilidad: parseFloat((96 + Math.random() * 4).toFixed(2))
    });
}

// Riesgo estudiantil
for(let i = 1; i <= 50; i++) {
    data.dim_estudiantes.push({
        estudiante: `Estudiante ${i}`,
        programa: ['Educación Inicial', 'Educación Primaria', 'Idiomas'][Math.floor(Math.random()*3)],
        dias_inactivo: Math.floor(Math.random() * 20) + 5,
        calificacion_promedio: (Math.random() * 10 + 5).toFixed(1),
        nivel_riesgo: Math.random() > 0.7 ? 'Alto' : 'Medio'
    });
}

fs.writeFileSync('data/dataset.json', JSON.stringify(data, null, 2));
console.log('Dataset unificado con portafolio generado.');
