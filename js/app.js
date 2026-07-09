document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Navegación, UI y Exportación
    // ---------------------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    const pageViews = document.querySelectorAll('.page-view');
    const pageTitle = document.getElementById('page-title');
    
    // Elementos Mobile
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    const toggleSidebar = () => { sidebar.classList.toggle('open'); mobileOverlay.classList.toggle('active'); };
    const closeSidebar = () => { sidebar.classList.remove('open'); mobileOverlay.classList.remove('active'); };

    if(menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if(mobileOverlay) mobileOverlay.addEventListener('click', closeSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            pageTitle.textContent = item.querySelector('span').textContent.trim();

            const targetPage = item.getAttribute('data-page');
            pageViews.forEach(page => {
                page.classList.remove('active');
                if(page.id === targetPage) page.classList.add('active');
            });
            
            if(window.innerWidth <= 768) closeSidebar();
            window.dispatchEvent(new Event('resize'));
        });
    });

    // Configurar Fecha
    const dateStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('current-date').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    // LOGICA DE EXPORTACIÓN (html2canvas)
    const exportBtn = document.getElementById('export-btn');
    if(exportBtn) {
        exportBtn.addEventListener('click', () => {
            const activePage = document.querySelector('.page-view.active');
            const originalHTML = exportBtn.innerHTML;
            
            // Estado de carga
            exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
            exportBtn.style.opacity = '0.8';
            exportBtn.style.pointerEvents = 'none';

            // Pequeño timeout para permitir que el UI se actualice antes de congelar el thread
            setTimeout(() => {
                // Capturar el área de contenido
                const captureArea = document.getElementById('export-area');
                
                html2canvas(captureArea, {
                    scale: 2, // Alta resolución
                    backgroundColor: '#fafbfc', // Color de fondo premium
                    logging: false,
                    useCORS: true,
                    windowWidth: captureArea.scrollWidth,
                    windowHeight: captureArea.scrollHeight
                }).then(canvas => {
                    const link = document.createElement('a');
                    const dateTag = new Date().toISOString().slice(0,10);
                    link.download = `Reporte_SmartCampus_${activePage.id}_${dateTag}.jpg`;
                    link.href = canvas.toDataURL('image/jpeg', 0.95);
                    link.click();
                    
                    // Restaurar botón
                    exportBtn.innerHTML = originalHTML;
                    exportBtn.style.opacity = '1';
                    exportBtn.style.pointerEvents = 'auto';
                }).catch(err => {
                    console.error('Error en exportación:', err);
                    exportBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error';
                    setTimeout(() => {
                        exportBtn.innerHTML = originalHTML;
                        exportBtn.style.opacity = '1';
                        exportBtn.style.pointerEvents = 'auto';
                    }, 3000);
                });
            }, 300);
        });
    }

    // ---------------------------------------------------------
    // 2. Configuración Global de Gráficos (Ultra Premium)
    // ---------------------------------------------------------
    const commonOptions = {
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800, dynamicAnimation: { enabled: true, speed: 350 } }
    };

    // Sparklines para las Tarjetas KPI
    const sparklineOptions = {
        chart: { type: 'area', height: 45, sparkline: { enabled: true } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 100] } },
        tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: function (s) { return '' } } }, marker: { show: false } }
    };

    // Página 1 Sparklines
    new ApexCharts(document.querySelector("#spark1"), { ...sparklineOptions, series: [{ data: [30, 40, 35, 50, 49, 60, 63] }], colors: ['#4f46e5'] }).render();
    new ApexCharts(document.querySelector("#spark2"), { ...sparklineOptions, series: [{ data: [60, 65, 75, 80, 82, 85, 85] }], colors: ['#10b981'] }).render();
    new ApexCharts(document.querySelector("#spark3"), { ...sparklineOptions, series: [{ data: [5, 4, 4, 3, 2, 2, 2] }], colors: ['#ef4444'] }).render();
    new ApexCharts(document.querySelector("#spark4"), { ...sparklineOptions, series: [{ data: [90, 92, 95, 98, 100, 100, 100] }], colors: ['#0ea5e9'] }).render();

    // Página 3 Sparklines
    new ApexCharts(document.querySelector("#spark-eva"), { ...sparklineOptions, series: [{ data: [800, 950, 1100, 1300, 1400, 1452] }], colors: ['#4f46e5'] }).render();
    new ApexCharts(document.querySelector("#spark-cursos"), { ...sparklineOptions, series: [{ data: [100, 110, 120, 124, 124, 124] }], colors: ['#0ea5e9'] }).render();
    new ApexCharts(document.querySelector("#spark-tramites"), { ...sparklineOptions, series: [{ data: [30, 35, 45, 50, 55, 60] }], colors: ['#f59e0b'] }).render();


    // ---------------------------------------------------------
    // 3. Gráficos Principales - Página 1
    // ---------------------------------------------------------
    new ApexCharts(document.querySelector("#chart-cbc"), {
        ...commonOptions,
        series: [85],
        chart: { type: 'radialBar', height: 360 },
        plotOptions: {
            radialBar: {
                startAngle: -135, endAngle: 135, hollow: { size: '65%' },
                track: { background: '#f8fafc', strokeWidth: '100%', dropShadow: { enabled: true, top: 0, left: 0, blur: 3, opacity: 0.1 } },
                dataLabels: {
                    name: { fontSize: '15px', color: '#64748b', offsetY: 20, fontFamily: 'Inter' },
                    value: { fontSize: '48px', fontWeight: 800, fontFamily: 'Outfit', color: '#0f172a', offsetY: -10, formatter: val => val + "%" }
                }
            }
        },
        fill: { type: 'gradient', gradient: { shade: 'dark', type: 'horizontal', gradientToColors: ['#818cf8'], stops: [0, 100] } },
        stroke: { lineCap: 'round' },
        colors: ['#4f46e5'],
        labels: ['Nivel Acreditación']
    }).render();

    new ApexCharts(document.querySelector("#chart-riesgo"), {
        ...commonOptions,
        series: [{ name: 'Riesgo Deserción (%)', data: [18.2, 17.5, 16.1, 14.8, 13.5, 12.0] }],
        chart: { type: 'area', height: 340, dropShadow: { enabled: true, top: 10, left: 0, blur: 5, color: '#f59e0b', opacity: 0.2 } },
        colors: ['#f59e0b'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05, stops: [0, 100] } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { min: 0, max: 20, labels: { formatter: val => val + '%' } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 5, padding: { top: 0, right: 0, bottom: 0, left: 10 } }
    }).render();


    // ---------------------------------------------------------
    // 4. Gráficos Principales - Página 2
    // ---------------------------------------------------------
    new ApexCharts(document.querySelector("#chart-actividades-oeti"), {
        ...commonOptions,
        series: [
            { name: 'Ejecutadas', data: [1, 2, 0, 1] }, 
            { name: 'En Proceso', data: [1, 1, 2, 2] },
            { name: 'Atrasadas', data: [0, 0, 1, 0] }
        ],
        chart: { type: 'bar', height: 340, stacked: true },
        colors: ['#10b981', '#4f46e5', '#ef4444'],
        plotOptions: { bar: { horizontal: false, columnWidth: '30%', borderRadius: 8 } },
        xaxis: { categories: ['OETI 1.x', 'OETI 2.x', 'OETI 3.x', 'OETI 4.x'], axisBorder: { show: false }, axisTicks: { show: false } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 5 },
        legend: { position: 'top', horizontalAlign: 'right', fontFamily: 'Inter', fontWeight: 500 }
    }).render();

    new ApexCharts(document.querySelector("#chart-avance-trimestre"), {
        ...commonOptions,
        series: [
            { name: 'Meta Planificada', data: [25, 50, 75, 100] }, 
            { name: 'Avance Real', data: [22, 45, 68, null] }
        ],
        chart: { type: 'line', height: 340 },
        colors: ['#cbd5e1', '#4f46e5'],
        stroke: { curve: 'smooth', width: [3, 4], dashArray: [5, 0] },
        xaxis: { categories: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'], axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { max: 100, labels: { formatter: val => val + '%' } },
        markers: { size: [0, 7], colors: ['#ffffff'], strokeColors: '#4f46e5', strokeWidth: 3, hover: { size: 9 } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 5 },
        legend: { position: 'top', horizontalAlign: 'right', fontFamily: 'Inter', fontWeight: 500 }
    }).render();

    new ApexCharts(document.querySelector("#chart-gantt"), {
        ...commonOptions,
        series: [{
            data: [
                { x: 'Auditoría CBC-TI', y: [new Date('2027-01-01').getTime(), new Date('2027-03-31').getTime()], fillColor: '#10b981' },
                { x: 'Despliegue EVA Nube', y: [new Date('2027-02-01').getTime(), new Date('2027-08-30').getTime()], fillColor: '#4f46e5' },
                { x: 'Interoperabilidad SGA', y: [new Date('2027-07-01').getTime(), new Date('2028-02-28').getTime()], fillColor: '#ef4444' }
            ]
        }],
        chart: { type: 'rangeBar', height: 260 },
        plotOptions: { bar: { horizontal: true, borderRadius: 8, barHeight: '40%' } },
        xaxis: { type: 'datetime', axisBorder: { show: false }, axisTicks: { show: false } },
        grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } }, borderColor: '#f1f5f9', strokeDashArray: 5 }
    }).render();

    // Tabla Portafolio
    const portData = [
        { id: 'OETI 1.1', d: 'Auditoría tecnológica de laboratorios', s: 'T1 27', e: 'Perm', r: '<div class="user-row"><div class="avatar-sm">JO</div> Jef. OTI</div>', st: 'En Proceso', cl: 'success' },
        { id: 'OETI 2.1', d: 'EVA en Nube e Integración', s: 'T1 27', e: 'T3 27', r: '<div class="user-row"><div class="avatar-sm bg-info text-info">RC</div> Redes</div>', st: 'En Proceso', cl: 'success' },
        { id: 'OETI 3.3', d: 'SGA Interoperable y API REST', s: 'T3 27', e: 'T4 28', r: '<div class="user-row"><div class="avatar-sm bg-danger text-danger">DT</div> Desarr.</div>', st: 'Crítico', cl: 'danger' }
    ];
    const tbody = document.getElementById('table-portfolio');
    portData.forEach(i => {
        tbody.innerHTML += `<tr><td><span class="fw-600">${i.id}</span></td><td>${i.d}</td><td>${i.s}</td><td>${i.e}</td><td>${i.r}</td><td><span class="badge ${i.cl}">${i.st}</span></td></tr>`;
    });


    // ---------------------------------------------------------
    // 5. Gráficos Principales - Página 3
    // ---------------------------------------------------------
    new ApexCharts(document.querySelector("#chart-usuarios-eva"), {
        ...commonOptions,
        series: [{ name: 'Accesos Únicos Diarios', data: [850, 920, 1100, 1452, 1350, 900, 850, 1300, 1420, 1452] }],
        chart: { type: 'area', height: 340, dropShadow: { enabled: true, top: 10, left: 0, blur: 5, color: '#4f46e5', opacity: 0.15 } },
        colors: ['#4f46e5'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.0, stops: [0, 100] } },
        xaxis: { categories: ['D1', 'D3', 'D6', 'D9', 'D12', 'D15', 'D18', 'D21', 'D24', 'D30'], axisBorder: { show: false }, axisTicks: { show: false } },
        stroke: { curve: 'smooth', width: 4 },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 5 },
        dataLabels: { enabled: false }
    }).render();

    new ApexCharts(document.querySelector("#chart-tramites-donut"), {
        ...commonOptions,
        series: [60, 40],
        labels: ['Trámites Digitales', 'Trámites Físicos'],
        chart: { type: 'donut', height: 340 },
        colors: ['#0ea5e9', '#e2e8f0'],
        plotOptions: { pie: { donut: { size: '78%', labels: { show: true, name: { show: true, color: '#64748b', fontFamily: 'Inter', fontWeight: 500 }, value: { show: true, fontSize: '36px', fontFamily: 'Outfit', fontWeight: 800, color: '#0f172a', formatter: val => val + "%" } } } } },
        dataLabels: { enabled: false },
        stroke: { show: false },
        legend: { position: 'bottom', fontFamily: 'Inter', fontWeight: 500 }
    }).render();


    // ---------------------------------------------------------
    // 6. Gráficos Principales - Página 4
    // ---------------------------------------------------------
    new ApexCharts(document.querySelector("#chart-tickets"), {
        ...commonOptions,
        series: [
            { name: 'Hardware / Red', data: [45, 30, 25, 20] }, 
            { name: 'Software / EVA', data: [80, 60, 50, 45] }
        ],
        chart: { type: 'bar', height: 340, stacked: true },
        colors: ['#ef4444', '#0ea5e9'],
        xaxis: { categories: ['Marzo', 'Abril', 'Mayo', 'Junio'], axisBorder: { show: false }, axisTicks: { show: false } },
        plotOptions: { bar: { columnWidth: '35%', borderRadius: 6 } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 5 },
        legend: { position: 'top', horizontalAlign: 'right', fontFamily: 'Inter', fontWeight: 500 }
    }).render();

    new ApexCharts(document.querySelector("#chart-seguridad"), {
        ...commonOptions,
        series: [{ name: 'Accesos Maliciosos Bloqueados', data: [12, 18, 5, 22, 15, 8, 3] }],
        chart: { type: 'line', height: 340, dropShadow: { enabled: true, top: 10, left: 0, blur: 5, color: '#ef4444', opacity: 0.2 } },
        colors: ['#ef4444'],
        stroke: { curve: 'stepline', width: 3 },
        xaxis: { categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'], axisBorder: { show: false }, axisTicks: { show: false } },
        markers: { size: 6, colors: ['#ffffff'], strokeColors: '#ef4444', strokeWidth: 3, hover: { size: 9 } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 5 }
    }).render();

});
