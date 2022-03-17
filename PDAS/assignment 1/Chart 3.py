import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.widgets import Button, RadioButtons, CheckButtons, Cursor

mpl.use('TkAgg')

raw_data = np.genfromtxt(
    './Datasets/(1) Price Range of HDB Flats Offered/price-range-of-hdb-flats-offered.csv',
    delimiter=',', names=True,
    dtype=[('financial_year', 'i8'), ('town', 'U20'), ('room_type', 'U8'),
           ('min_selling_price', 'i8'), ('max_selling_price', 'i8')])

financial_year = []
town = []
room_type = []
min_selling_price = []
max_selling_price = []

for row in raw_data:
    financial_year.append(row[0])
    town.append(row[1])
    room_type.append(row[2])
    min_selling_price.append(row[3])
    max_selling_price.append(row[4])

mean_selling_price = np.mean(np.array([min_selling_price, max_selling_price]),
                             axis=0)

cleaned_data = {
    'financial_year': np.array(financial_year),
    'town': np.array(town),
    'room_type': np.array(room_type),
    'min_selling_price': np.array(min_selling_price),
    'max_selling_price': np.array(max_selling_price),
    'mean_selling_price': np.array(mean_selling_price)
}
unique_year = np.unique(cleaned_data['financial_year'])
cumulative_price = dict.fromkeys(unique_year, 0)
temp_price = []
for key in cumulative_price.keys():
    for i in range(len(min_selling_price)):
        if cleaned_data['financial_year'][i] == key:
            temp_price.append(min_selling_price[i])
    cumulative_price[key] = round((sum(temp_price) / len(temp_price)), 2)
    temp_price = []

X = unique_year
Y = 3540 * X - 6.928e+006

fig = plt.figure()
ax1 = fig.add_subplot(111)
line1, = ax1.plot(unique_year, cumulative_price.values(), '-o', label='actual '
                                                                      'graph',visible=False)
line2, = ax1.plot(X, Y, 'o--', label='trend graph',visible=False)
plt.rcParams['figure.figsize'] = [30, 10]
plt.tick_params(axis='x', colors='black', )
plt.tick_params(axis='y', colors='black')
ax1.set_xticks(unique_year)
plt.grid(True)
plt.title('Line Graph of Time vs Average House Prices in Singapore',
          color='black', fontsize='30')
# Defining the cursor
cursor = Cursor(ax1, horizOn=True, vertOn=True, useblit=True,
                color='red', linewidth=1, alpha=0.5)
# Creating an annotating box
annot = ax1.annotate("", xy=(0, 0), xytext=(-40, 40),
                     textcoords="offset points",
                     bbox=dict(boxstyle='round4', fc='linen', ec='k', lw=1),
                     arrowprops=dict(arrowstyle='-|>'))
annot.set_visible(False)
# Function for storing and showing the clicked values
coord = []


def onclick(event):
    global coord
    coord.append((event.xdata, event.ydata))
    x = event.xdata
    y = event.ydata

    # printing the values of the selected point
    annot.xy = (x, y)
    text = f"{y:.2f}"
    annot.set_text(text)
    annot.set_visible(True)
    fig.canvas.draw()  # redraw the figure


fig.canvas.mpl_connect('button_press_event', onclick)

labels = ['Actual Graph', 'Trend Line']
ax_check = plt.axes([0.01, 0.01, 0.11, 0.1])
plots = [line1, line2]
activated = [(line.get_visible()) for line in plots]
plot_button = CheckButtons(ax_check, labels, activated)


# function for displaying/hiding the plots
def select_plot(label):
    # get the index that corresponds to the word "label"
    index = labels.index(label)

    # set the plot to visible
    plots[index].set_visible(not plots[index].get_visible())
    fig.canvas.draw()


plot_button.on_clicked(select_plot)
plt.show()
