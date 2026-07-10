let data = null;
let filteredFact = [];
let filteredProy = [];
let currentPage = 'page1';
let charts = {};

// Power BI Default Colors
const pbiPalette = ['#118DFF', '#12239E', '#E66C37', '#6B007B', '#E044A7', '#744DA9', '#D9B300', '#00B8AA', '#F68923'];
const textSecondary = '#605e5c';
const borderCol = '#e1dfdd';

// Global Active Filters State (Star Schema filtering)
const activeFilters = {
    trimestre: 'all',
    estado: 'all',
    responsable: 'all',
    oeti: 'all' // Added OETI filter
};

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    loadData();
    setupEventListeners();
    
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(c => c && c.resize());
    });
});

function initCharts() {
    const ids = ['p1-gauge-cbc', 'p1-bar-estado', 'p1-trend-riesgo', 'p1-pie-resp', 
                 'p2-bar-oeti', 'p2-line-avance', 'p2-gantt',
                 'p3-gauge-biblio', 'p3-bar-tramites', 'p3-line-eva',
                 'p4-gauge-disp', 'p4-line-inc', 'p4-bar-tickets'];
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            charts[id] = echarts.init(el, null, { renderer: 'svg' });
            
            // Add cross-filtering events
            charts[id].on('click', function(params) {
                handleChartClick(id, params);
            });
        }
    });
}

function handleChartClick(chartId, params) {
    // Map chart clicks to filter dimensions
    if(chartId === 'p1-bar-estado') {
        activeFilters.estado = params.name;
        document.getElementById('filter-estado').value = params.name;
    } 
    else if(chartId === 'p1-pie-resp') {
        activeFilters.responsable = params.name;
        document.getElementById('filter-responsable').value = params.name;
    }
    else if(chartId === 'p2-bar-oeti') {
        activeFilters.oeti = params.name;
        // no dropdown for oeti, but we filter anyway
    }
    else if(chartId === 'p2-line-avance' || chartId === 'p3-bar-tramites' || chartId === 'p3-line-eva' || chartId === 'p4-line-inc' || chartId === 'p4-bar-tickets') {
        // These x-axis are usually "trimestre"
        if(params.name && params.name.startsWith('Q')) {
            activeFilters.trimestre = params.name;
            document.getElementById('filter-trimestre').value = params.name;
        }
    }
    
    applyFilters();
}

async function loadData() {
    try {
        const response = await fetch('data/dataset.json');
        data = await response.json();
        applyFilters();
    } catch (e) {
        console.error("Error loading data:", e);
    }
}

function setupEventListeners() {
    // Page Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.page-container').forEach(p => p.classList.remove('active'));
            
            e.currentTarget.classList.add('active');
            currentPage = e.currentTarget.getAttribute('data-page');
            document.getElementById(currentPage).classList.add('active');
            
            const titles = {
                'page1': 'Resumen Ejecutivo',
                'page2': 'Portafolio de Proyectos TI',
                'page3': 'Servicios Digitales y EVA',
                'page4': 'Seguridad, Soporte y Continuidad'
            };
            document.getElementById('page-title').textContent = titles[currentPage];
            
            setTimeout(() => { Object.values(charts).forEach(c => c && c.resize()); }, 50);
            updatePageCharts();
        });
    });

    // Dropdown Filters
    const updateGlobalFilters = () => {
        activeFilters.trimestre = document.getElementById('filter-trimestre').value;
        activeFilters.estado = document.getElementById('filter-estado').value;
        activeFilters.responsable = document.getElementById('filter-responsable').value;
        activeFilters.oeti = 'all'; // reset implicit filter on dropdown change
        applyFilters();
    };

    document.getElementById('filter-trimestre').addEventListener('change', updateGlobalFilters);
    document.getElementById('filter-estado').addEventListener('change', updateGlobalFilters);
    document.getElementById('filter-responsable').addEventListener('change', updateGlobalFilters);

    document.getElementById('reset-filters').addEventListener('click', () => {
        activeFilters.trimestre = 'all';
        activeFilters.estado = 'all';
        activeFilters.responsable = 'all';
        activeFilters.oeti = 'all';
        
        document.getElementById('filter-trimestre').value = 'all';
        document.getElementById('filter-estado').value = 'all';
        document.getElementById('filter-responsable').value = 'all';
        
        applyFilters();
    });
}

function applyFilters() {
    if(!data) return;

    // Filter Logic simulating a star schema join
    filteredFact = data.fact_diaria.filter(d => {
        if(activeFilters.trimestre !== 'all' && d.trimestre !== activeFilters.trimestre) return false;
        if(activeFilters.estado !== 'all' && d.estado !== activeFilters.estado) return false;
        if(activeFilters.responsable !== 'all' && d.responsable !== activeFilters.responsable) return false;
        if(activeFilters.oeti !== 'all' && d.oeti !== activeFilters.oeti) return false;
        return true;
    });

    filteredProy = data.portafolioProyectos ? data.portafolioProyectos.filter(p => {
        if(activeFilters.estado !== 'all' && p.estado !== activeFilters.estado) return false;
        if(activeFilters.responsable !== 'all' && p.res !== activeFilters.responsable) return false;
        if(activeFilters.oeti !== 'all' && p.oeti !== activeFilters.oeti) return false;
        // Trimestre doesn't directly filter static projects unless we check start/end date
        return true;
    }) : [];

    updateFilterDisplay();
    updatePageCharts();
}

function updateFilterDisplay() {
    const disp = document.getElementById('active-filters-display');
    const active = [];
    if(activeFilters.trimestre !== 'all') active.push(`Trimestre: ${activeFilters.trimestre}`);
    if(activeFilters.estado !== 'all') active.push(`Estado: ${activeFilters.estado}`);
    if(activeFilters.responsable !== 'all') active.push(`Resp: ${activeFilters.responsable}`);
    if(activeFilters.oeti !== 'all') active.push(`OETI: ${activeFilters.oeti}`);
    
    disp.textContent = active.length > 0 ? "Filtros aplicados | " + active.join(" | ") : "";
}

const getBaseOpt = () => ({
    backgroundColor: 'transparent',
    color: pbiPalette,
    tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: borderCol, textStyle: {color: '#252423'} },
    grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true }
});

const getAxisStyles = () => ({
    splitLine: { lineStyle: { color: borderCol, type: 'dashed' } },
    axisLine: { lineStyle: { color: textSecondary } },
    axisLabel: { color: textSecondary, fontSize: 11 }
});

function createGaugeOption(name, value) {
    return {
        series: [{
            type: 'gauge',
            progress: { show: true, width: 12, itemStyle: { color: pbiPalette[0] } },
            axisLine: { lineStyle: { width: 12 } },
            axisTick: { show: false },
            splitLine: { length: 10, lineStyle: { width: 2, color: '#fff' } },
            axisLabel: { distance: 15, color: textSecondary, fontSize: 10 },
            anchor: { show: true, showAbove: true, size: 16, itemStyle: { borderWidth: 4, borderColor: pbiPalette[0] } },
            title: { show: false },
            detail: { valueAnimation: true, fontSize: 24, fontWeight: 'bold', offsetCenter: [0, '70%'], color: '#252423', formatter: '{value}%' },
            data: [{ value: value > 0 ? value.toFixed(1) : 0, name }]
        }]
    };
}

function getStatusColor(s) {
    if(s === 'Cumplido') return 'green';
    if(s === 'En proceso') return 'grey';
    if(s === 'Riesgo medio') return 'yellow';
    return 'red';
}

function updatePageCharts() {
    if(currentPage === 'page1') updatePage1();
    if(currentPage === 'page2') updatePage2();
    if(currentPage === 'page3') updatePage3();
    if(currentPage === 'page4') updatePage4();
}

// ==============================
// PAGE 1 RENDER
// ==============================
function updatePage1() {
    if(!filteredFact.length) return;
    
    // KPIs
    const avgPeti = filteredFact.reduce((a, b) => a + b.avance_peti, 0) / filteredFact.length;
    document.getElementById('p1-kpi-peti').textContent = avgPeti.toFixed(1) + '%';
    const incTotal = filteredFact.reduce((a, b) => a + b.incidentes_ti, 0);
    document.getElementById('p1-kpi-inc').textContent = (incTotal / filteredFact.length * 30).toFixed(0);
    
    const criticosCount = filteredFact.filter(f => f.estado === 'Crítico').length;
    document.getElementById('p1-kpi-crit').textContent = criticosCount > 0 ? Math.ceil(criticosCount / 30) : 0; 

    // Gauge CBC
    const avgCbc = filteredFact.reduce((a, b) => a + b.cumplimiento_cbc, 0) / filteredFact.length;
    charts['p1-gauge-cbc'].setOption(createGaugeOption('CBC-TI', avgCbc));

    // Estado General (Bar)
    const estMap = new Map();
    filteredFact.forEach(d => { estMap.set(d.estado, (estMap.get(d.estado)||0) + 1); });
    const estOpt = getBaseOpt();
    estOpt.xAxis = { type: 'category', data: Array.from(estMap.keys()), ...getAxisStyles(), splitLine:{show:false} };
    estOpt.yAxis = { type: 'value', ...getAxisStyles() };
    estOpt.series = [{ type: 'bar', data: Array.from(estMap.values()), itemStyle: { color: pbiPalette[1] } }];
    charts['p1-bar-estado'].setOption(estOpt);

    // Trend Riesgo
    const trMap = new Map();
    filteredFact.forEach(d => {
        if(!trMap.has(d.trimestre)) trMap.set(d.trimestre, {s:0, c:0});
        trMap.get(d.trimestre).s += (d.avance_peti < 50 ? 1 : 0); 
        trMap.get(d.trimestre).c++;
    });
    const tr = Array.from(trMap.keys()).sort();
    const trVals = tr.map(t => ((trMap.get(t).s/trMap.get(t).c)*100).toFixed(1));
    const trendOpt = getBaseOpt();
    trendOpt.xAxis = { type: 'category', boundaryGap: false, data: tr, ...getAxisStyles(), splitLine:{show:false} };
    trendOpt.yAxis = { type: 'value', ...getAxisStyles() };
    trendOpt.series = [{ type: 'line', data: trVals, areaStyle: {opacity:0.1}, itemStyle: { color: pbiPalette[2] } }];
    charts['p1-trend-riesgo'].setOption(trendOpt);

    // Responsable (Pie)
    const respMap = new Map();
    filteredFact.forEach(d => respMap.set(d.responsable, (respMap.get(d.responsable)||0) + 1));
    const pieData = Array.from(respMap.entries()).map(([k, val]) => ({name:k, value:val}));
    charts['p1-pie-resp'].setOption({
        color: pbiPalette, tooltip: { trigger: 'item' }, legend: { show: false },
        series: [{ type: 'pie', radius: ['40%', '70%'], center: ['50%', '50%'], data: pieData }]
    });
}

// ==============================
// PAGE 2 RENDER
// ==============================
function updatePage2() {
    if(!filteredProy.length && !filteredFact.length) return;
    
    // Bar OETI
    const oetiAvg = {};
    filteredFact.forEach(p => { 
        if(!oetiAvg[p.oeti]) oetiAvg[p.oeti] = {s:0, c:0}; 
        oetiAvg[p.oeti].s += p.avance_peti; oetiAvg[p.oeti].c++; 
    });
    const oLabels = Object.keys(oetiAvg);
    const oVals = oLabels.map(l => (oetiAvg[l].s / oetiAvg[l].c).toFixed(1));
    const barOpt = getBaseOpt();
    barOpt.xAxis = { type: 'category', data: oLabels, ...getAxisStyles(), splitLine:{show:false} };
    barOpt.yAxis = { type: 'value', ...getAxisStyles() };
    barOpt.series = [{ type: 'bar', data: oVals, itemStyle: { color: pbiPalette[3] } }];
    charts['p2-bar-oeti'].setOption(barOpt);

    // Line Avance
    const tMap = new Map();
    filteredFact.forEach(r => { 
        if(!tMap.has(r.trimestre)) tMap.set(r.trimestre, {s:0, c:0}); 
        tMap.get(r.trimestre).s += r.avance_peti; tMap.get(r.trimestre).c++; 
    });
    const tr2 = Array.from(tMap.keys()).sort();
    const v2 = tr2.map(t => (tMap.get(t).s/tMap.get(t).c).toFixed(1));
    const lineOpt = getBaseOpt();
    lineOpt.xAxis = { type: 'category', data: tr2, ...getAxisStyles(), splitLine:{show:false} };
    lineOpt.yAxis = { type: 'value', ...getAxisStyles() };
    lineOpt.series = [{ type: 'line', data: v2, itemStyle: { color: pbiPalette[4] }, smooth: true }];
    charts['p2-line-avance'].setOption(lineOpt);

    // Gantt
    if(filteredProy && charts['p2-gantt']) {
        const pNames = filteredProy.map(p => p.nombre);
        const startData = filteredProy.map(p => new Date(p.inicio).getTime());
        const minStart = Math.min(...startData) || new Date().getTime();
        const lengthData = filteredProy.map(p => new Date(p.fin).getTime() - new Date(p.inicio).getTime());
        
        const ganttOpt = getBaseOpt();
        ganttOpt.tooltip = { formatter: (params) => params.name };
        ganttOpt.xAxis = { type: 'value', show: false };
        ganttOpt.yAxis = { type: 'category', data: pNames, inverse: true, axisLabel:{width:100, overflow:'truncate'} };
        ganttOpt.series = [
            { type: 'bar', stack: 'total', itemStyle: { borderColor: 'transparent', color: 'transparent' }, data: startData.map(d => d - minStart) },
            { type: 'bar', stack: 'total', data: lengthData, itemStyle: { color: pbiPalette[5], borderRadius: 4 } }
        ];
        charts['p2-gantt'].setOption(ganttOpt);

        // Table
        document.getElementById('p2-table-proyectos').innerHTML = filteredProy.map(p => `<tr><td>${p.nombre}</td><td><span class="status-dot ${getStatusColor(p.estado)}"></span>${p.estado}</td><td>${p.avance}%</td></tr>`).join('');
        
        // Pivot
        const respAvg = {};
        filteredProy.forEach(p => { if(!respAvg[p.res]) respAvg[p.res] = {s:0, c:0}; respAvg[p.res].s+=p.avance; respAvg[p.res].c++; });
        document.getElementById('p2-pivot-resp').innerHTML = Object.keys(respAvg).map(r => `<tr><td>${r}</td><td>${respAvg[r].c}</td><td>${(respAvg[r].s/respAvg[r].c).toFixed(1)}%</td></tr>`).join('');
    }
}

// ==============================
// PAGE 3 RENDER
// ==============================
function updatePage3() {
    if(!filteredFact.length) return;
    
    const avgCursos = filteredFact.reduce((a, b) => a + b.cursos_activos, 0) / filteredFact.length;
    document.getElementById('p3-kpi-cursos').textContent = avgCursos.toFixed(0);

    const avgBib = filteredFact.reduce((a, b) => a + b.uso_biblioteca, 0) / filteredFact.length;
    charts['p3-gauge-biblio'].setOption(createGaugeOption('Biblioteca', avgBib));

    const tMap = new Map();
    filteredFact.forEach(r => { 
        if(!tMap.has(r.trimestre)) tMap.set(r.trimestre, {eva:0, tr:0, c:0}); 
        tMap.get(r.trimestre).eva += r.usuarios_eva; 
        tMap.get(r.trimestre).tr += r.tramites_digitales; 
        tMap.get(r.trimestre).c++; 
    });
    const tr = Array.from(tMap.keys()).sort();
    
    const barOpt = getBaseOpt();
    barOpt.xAxis = { type: 'category', data: tr, ...getAxisStyles(), splitLine:{show:false} };
    barOpt.yAxis = { type: 'value', ...getAxisStyles() };
    barOpt.series = [{ type: 'bar', data: tr.map(t => (tMap.get(t).tr/tMap.get(t).c).toFixed(0)), itemStyle: { color: pbiPalette[6] } }];
    charts['p3-bar-tramites'].setOption(barOpt);

    const lineOpt = getBaseOpt();
    lineOpt.xAxis = { type: 'category', data: tr, boundaryGap:false, ...getAxisStyles(), splitLine:{show:false} };
    lineOpt.yAxis = { type: 'value', ...getAxisStyles() };
    lineOpt.series = [{ type: 'line', smooth: true, areaStyle: {opacity:0.2}, data: tr.map(t => (tMap.get(t).eva/tMap.get(t).c).toFixed(0)), itemStyle: { color: pbiPalette[7] } }];
    charts['p3-line-eva'].setOption(lineOpt);

    if(data.dim_estudiantes) {
        document.getElementById('p3-table-alertas').innerHTML = data.dim_estudiantes.slice(0, 10).map(a => `
            <tr><td>${a.estudiante}</td><td>${a.programa}</td><td>${a.dias_inactivo}</td>
            <td><span class="status-dot ${a.nivel_riesgo === 'Alto' ? 'red' : 'yellow'}"></span>${a.nivel_riesgo}</td></tr>
        `).join('');
    }
}

// ==============================
// PAGE 4 RENDER
// ==============================
function updatePage4() {
    if(!filteredFact.length) return;
    
    const avgTiempo = filteredFact.reduce((a, b) => a + b.tiempo_respuesta, 0) / filteredFact.length;
    document.getElementById('p4-kpi-tiempo').textContent = avgTiempo.toFixed(1) + ' hrs';
    
    const totBackups = filteredFact.reduce((a, b) => a + b.backups, 0);
    document.getElementById('p4-kpi-backups').textContent = totBackups;

    const avgDisp = filteredFact.reduce((a, b) => a + parseFloat(b.disponibilidad), 0) / filteredFact.length;
    charts['p4-gauge-disp'].setOption(createGaugeOption('Disponibilidad', avgDisp));

    const tMap = new Map();
    filteredFact.forEach(r => { 
        if(!tMap.has(r.trimestre)) tMap.set(r.trimestre, {inc:0, tic:0, c:0}); 
        tMap.get(r.trimestre).inc += r.incidentes_seguridad; 
        tMap.get(r.trimestre).tic += r.tickets_atendidos; 
        tMap.get(r.trimestre).c++; 
    });
    const tr = Array.from(tMap.keys()).sort();

    const lineOpt = getBaseOpt();
    lineOpt.xAxis = { type: 'category', data: tr, ...getAxisStyles(), splitLine:{show:false} };
    lineOpt.yAxis = { type: 'value', ...getAxisStyles() };
    lineOpt.series = [{ type: 'line', data: tr.map(t => tMap.get(t).inc), itemStyle: { color: pbiPalette[8] } }];
    charts['p4-line-inc'].setOption(lineOpt);

    const barOpt = getBaseOpt();
    barOpt.xAxis = { type: 'category', data: tr, ...getAxisStyles(), splitLine:{show:false} };
    barOpt.yAxis = { type: 'value', ...getAxisStyles() };
    barOpt.series = [{ type: 'bar', data: tr.map(t => tMap.get(t).tic), itemStyle: { color: pbiPalette[0] } }];
    charts['p4-bar-tickets'].setOption(barOpt);
}
