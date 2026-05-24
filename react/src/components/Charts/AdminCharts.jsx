import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// تنسيق الـ Tooltip ليعرض النصوص بالعربية
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#64748b' }}>{label || payload[0].name}</p>
                <p style={{ margin: 0, color: payload[0].fill }}>
                    العدد: {payload[0].value.toLocaleString('ar-EG')}
                </p>
            </div>
        );
    }
    return null;
};

export const DailyBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                interval={0}
            />
            <YAxis
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={40}
                tick={{ fill: '#64748b', dx: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
                dataKey="count"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={1500} // إضافة حركة انسيابية للأعمدة
            />
        </BarChart>
    </ResponsiveContainer>
);

export const StatusDonutChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={250}>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                animationDuration={1500} // إضافة حركة دورانية للدائرة
            >
                {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
            />
        </PieChart>
    </ResponsiveContainer>
);