import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.widgets import Button, CheckButtons

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

raw_data_1 = np.genfromtxt(
    './Datasets/(1) Price Range of HDB Flats Offered/price-range-of-hdb-flats-offered.csv',
    delimiter=',', names=True,
    dtype=[('financial_year', 'i8'), ('town', 'U20'), ('room_type', 'U8'),
           ('min_selling_price', 'i8'), ('max_selling_price', 'i8')])

raw_data_2 = np.genfromtxt(
    '././Datasets/(2) Bookings for New Flats/bookings-for-new-flats.csv',
    delimiter=',', names=True,
    dtype=[('financial_year', 'i8'), ('no_of_units', 'i8')])

raw_data_3 = np.genfromtxt(
    '././Datasets/(3) Flats Constructed/flats-constructed-by-housing-and-development-board-annual.csv',
    delimiter=',', names=True,
    dtype=[('year', 'i8'), ('flats_constructed', 'i8')])

raw_data_3 = raw_data_3[31:]

# array declaration
no_of_units = []
financial_year = []
min_selling_price = []
max_selling_price = []
flats_constructed = []
# adding data to arrays
for row in raw_data_1:
    financial_year.append(row[0])
    min_selling_price.append(row[3])
    max_selling_price.append(row[4])

mean_selling_price = np.mean(np.array([min_selling_price, max_selling_price]),
                             axis=0)

unique_year = np.unique(np.array(financial_year))
cumulative_price = dict.fromkeys(unique_year, 0)
temp_price = []
for key in cumulative_price.keys():
    for i in range(len(mean_selling_price)):
        if financial_year[i] == key:
            temp_price.append(mean_selling_price[i])
    cumulative_price[key] = round((sum(temp_price) / len(temp_price)), 2)
    temp_price = []

for row in raw_data_2:
    no_of_units.append(row[1])

for row in raw_data_3:
    flats_constructed.append(row[1])

flats_constructed.append(
    35937)  # by linear regression y = 3191.5697x - 6404650.51515
flats_constructed.append(
    39129)  # by linear regression y = 3191.5697x - 6404650.51515
# graph plotting

plt.rcParams['figure.figsize'] = [15, 8]
fig = plt.figure()
ax1 = fig.add_subplot(111)
ax2 = ax1.twinx()
fig.suptitle(
    'Line Graph of Time vs Average House Prices in Singapore vs Flats Constructed',
    color='black', fontsize='30')
line1, = ax1.plot(unique_year, cumulative_price.values(), 'o-',
                  label='Average House Price', )
line2, = ax2.plot(unique_year, no_of_units, 'o-', label='New Flat Bookings',
                  color='indianred', visible=False)
line3, = ax1.plot(unique_year[:10], flats_constructed[:10], 'o-',
                  label='Flats Constructed', color='orange', visible=False)
line4, = ax1.plot(unique_year[9:], flats_constructed[9:], '--',
                  label='Flats Constructed', color='orange', visible=False)

ax1.set_xticks(unique_year)
ax1.set_xticklabels(unique_year)
ax1.tick_params(axis='x', colors='black', )
ax1.tick_params(axis='y', colors='black')
ax2.tick_params(axis='x', colors='black', )
ax2.tick_params(axis='y', colors='black')

ax1.grid(True)
ax_button = plt.axes([0.5, 0.025, 0.1, 0.05])
grid_button = Button(ax_button, 'Grid', color='white', hovercolor='grey')


def grid(val):
    ax1.grid()
    fig.canvas.draw()  # redraw the figure


grid_button.on_clicked(grid)

labels = ['Average House Price', 'New Flat Bookings', 'Flats '
                                                      'Constructed', 'Flats '
                                                                     'Constructed \nEstimate']
ax_check = plt.axes([0, 0.025, 0.11, 0.2])
plots = [line1, line2, line3, line4]
activated = [line.get_visible() for line in plots]
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
