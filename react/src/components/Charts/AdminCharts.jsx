import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const item = payload[0];

        return (
            <div
                style={{
                    backgroundColor: '#ffffff',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                    direction: 'rtl'
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontWeight: 'bold',
                        color: '#374151',
                        marginBottom: '8px',
                        fontSize: '14px'
                    }}
                >
                    {label || item.name || item.payload?.name}
                </p>

                <p
                    style={{
                        margin: 0,
                        color: item.fill || item.payload?.color || '#007c4d',
                        fontSize: '14px',
                        fontWeight: '700'
                    }}
                >
                    العدد: {Number(item.value || 0).toLocaleString('ar-EG')}
                </p>
            </div>
        );
    }

    return null;
};

// المخطط الشريطي للطلبات اليومية
export const DailyBarChart = ({ data = [] }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                />

                <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: '#64748b',
                        fontSize: 13
                    }}
                    interval={0}
                />

                <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tick={{
                        fill: '#64748b',
                        dx: 10,
                        fontSize: 13
                    }}
                    allowDecimals={false}
                />

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                        fill: '#f8fafc'
                    }}
                />

                <Bar
                    dataKey="count"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    animationDuration={1500}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

// المخطط الدائري لتوزيع الحالات
export const StatusDonutChart = ({ data = [] }) => {
    // نرسم داخل الدائرة فقط الحالات التي قيمتها أكبر من صفر
    const chartData = data.filter(item => Number(item.value) > 0);

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height={185}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1500}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* شرح الألوان يظهر دائماً حتى لو القيمة صفر */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '14px',
                    direction: 'rtl',
                    marginTop: '8px',
                    flexWrap: 'wrap'
                }}
            >
                {data.map((item) => (
                    <div
                        key={item.name}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#475569'
                        }}
                    >
                        <span
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: item.color,
                                display: 'inline-block'
                            }}
                        />

                        <span>{item.name}</span>

                        <span style={{ color: '#64748b' }}>
                            ({item.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};