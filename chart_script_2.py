import plotly.express as px
import plotly.graph_objects as go

# Data with abbreviated labels (following 15 char limit)
labels = ["On-task", "Follow Direct", "Social Interact", "Off-task", "Verbal Outburst", "Non-compliance"]
values = [35, 25, 20, 12, 5, 3]

# Use brand colors in specified order (following prior instructions)
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C']

# Create pie chart with proper ordering
fig = go.Figure(data=[go.Pie(
    labels=labels,
    values=values,
    marker_colors=colors,
    textinfo='percent',
    textposition='inside',
    marker=dict(line=dict(color='#FFFFFF', width=2)),
    sort=False  # Maintain original order
)])

# Update layout following pie chart instructions
fig.update_layout(
    title="Behavior Distribution",
    uniformtext_minsize=14, 
    uniformtext_mode='hide',
    showlegend=True
)

# Save the chart
fig.write_image("behavior_distribution.png")