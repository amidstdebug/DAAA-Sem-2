x = 5
total = [0.0] * x
totalString = ''
sumBill = 0.0
for i in range(x):
    bill = float(input('Enter bill #' + str(i+1) + ': '))
    total[i] = float(bill)
    sumBill = sumBill + bill

print('\nYour electricity bills for the past 6 months are:')

for q in range(x):
    print('${:.2f}'.format(total[q]), end=' ')

avg = sumBill/x

print('\n\nYour average electricity bill is $' + f'{avg:.2f}')