import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// 🟢 تنسيق الـ Tooltip ليعرض النصوص بالعربية بشكل أنيق عند تمرير الماوس
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', direction: 'rtl' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>
                    {label || payload[0].name}
                </p>
                <p style={{ margin: 0, color: payload[0].fill, fontSize: '14px', fontWeight: '600' }}>
                    العدد: {payload[0].value.toLocaleString('ar-EG')}
                </p>
            </div>
        );
    }
    return null;
};

// 📊 المخطط الشريطي (Bar Chart) للطلبات اليومية
export const DailyBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
                dataKey="day" /* يقرأ أيام الأسبوع من الـ JSON */
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 13 }}
                interval={0}
            />
            <YAxis
                orientation="right" /* ليتناسب مع الواجهة العربية RTL */
                axisLine={false}
                tickLine={false}
                width={40}
                tick={{ fill: '#64748b', dx: 10, fontSize: 13 }}
                allowDecimals={false} /* 🟢 الحل السحري لمنع الفواصل العشرية (نصف طلب أو ربع مواطن) */
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
                dataKey="count" /* يقرأ عدد الطلبات من الـ JSON */
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={1500}
            />
        </BarChart>
    </ResponsiveContainer>
);

// 🍩 المخطط الدائري المجوف (Donut Chart) لتوزيع الحالات
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
                animationDuration={1500}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '14px', color: '#475569' }}
            />
        </PieChart>
    </ResponsiveContainer>
);