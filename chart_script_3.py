import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
students = ["Student A", "Student B", "Student C", "Student D"]
positive_rates = [85, 72, 91, 68]

# Use the brand colors in order
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F']

# Create horizontal bar chart
fig = go.Figure(data=[
    go.Bar(
        y=students,
        x=positive_rates,
        orientation='h',
        marker=dict(color=colors),
        text=[f'{rate}%' for rate in positive_rates],
        textposition='inside',
        textfont=dict(size=14, color='white'),
        cliponaxis=False
    )
])

# Update layout
fig.update_layout(
    title='Student Behavior Success Comparison',
    xaxis_title='Positive Rate (%)',
    yaxis_title='Students',
    showlegend=False
)

# Update axes
fig.update_xaxes(range=[0, 100])
fig.update_yaxes()

# Save the chart
fig.write_image('student_behavior_comparison.png')