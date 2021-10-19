aList = [1, 1, 2, 3, 5, 8, 13, 21, 34, 4, 89]
listRange = 0
aNumbers = []
for q in range(len(aList)):
    if aList[q] < 5:
        aNumbers.append(aList[q])
print(aNumbers)
