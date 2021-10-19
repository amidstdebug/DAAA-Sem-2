x = 5
aList = []
maxVal = 0.0
minVal = 0.0
aMax = 1
aMin = 0

for i in range(x):
    aList.append(float(input(f'Input Number {i+1}: ')))


for q in range(len(aList)-1):
    if aList[aMax] > aList[q]:
        maxVal = aList[aMax]
    aMax = aMax + 1


minVal = aList[0]


for q in range(len(aList)-1):
    if aList[q+1] < minVal:
        minVal = aList[q+1]


print(f'Max is: {maxVal} \nMin is: {minVal}')