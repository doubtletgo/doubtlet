import React, { useEffect, useRef } from 'react';

interface BoxWhiskerChartProps {
  data: Array<{
    y: number[];
    name: string;
    boxpoints?: 'all' | 'outliers' | false;
    markerColor?: string;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layout?: Partial<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Partial<any>;
}

const BoxWhiskerChart: React.FC<BoxWhiskerChartProps> = ({
  data,
  layout,
  config,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const initPlotly = async () => {
        const Plotly = await import('plotly.js-dist');
        const traces = data.map((item) => ({
          type: 'box',
          y: item.y,
          name: item.name,
          boxpoints: item.boxpoints ?? 'outliers',
          marker: { color: item.markerColor ?? '#1f77b4' },
        }));

        // Default layout configuration
        const defaultLayout = {
          title: 'Final Answer',
          xaxis: { title: 'Groups' },
          showlegend: true,
          plot_bgcolor: '#F0FFFF',
          paper_bgcolor: '#fcf5fc',
        };

        // Merge custom layout with defaults
        const mergedLayout = { ...defaultLayout, ...layout };

        // Render the chart
        Plotly.newPlot(chartRef.current, traces, mergedLayout, config);

        return () => {
          // Clean up the chart on unmount
          Plotly.purge(chartRef.current!);
        };
      };
      initPlotly();
      // Map data to Plotly compatible traces
    }
  }, [data, layout, config]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default BoxWhiskerChart;
