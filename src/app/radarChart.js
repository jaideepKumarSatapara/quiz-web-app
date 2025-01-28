import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function RadarChart({ data }) {
    Chart.register(...registerables, ChartDataLabels);

    const chartData = {
        labels: data.map(item => item.trait),
        datasets: [
            {
                label: 'Your Traits',
                data: data.map(item => item.value),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: Math.max(...data.map(item => item.value)) + 1,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);
                        const percentage = ((tooltipItem.raw / totalValue) * 100).toFixed(1);
                        return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                    },
                    datalabels: {
                        color: '#fff',
                        formatter: (value) => {
                            const percentage = ((value / data.reduce((acc, cur) => acc + cur.value, 0)) * 100).toFixed(1);
                            return `${percentage}%`;
                        },
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>Your Personality Traits</h2>
            <Radar data={chartData} options={options} />
        </div>
    );
}