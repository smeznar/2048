import sys

scores = []
numOf2048 = 0
numOf4096 = 0
minScore = sys.maxsize
maxScore = 0
with open('scores100.txt', 'r') as file:
    for line in file:
        values = line.strip().split(' ')
        score = int(values[0])
        maxtile = int(values[1])
        if maxtile >= 2048:
            numOf2048 += 1
        if maxtile >= 4096:
            numOf4096 += 1
        scores.append(score)
        if score > maxScore:
            maxScore = score
        if score < minScore:
            minScore = score
mean = sum(scores)/len(scores)
p2048 = (numOf2048/len(scores)) * 100
p4096 = (numOf4096/len(scores)) * 100
print('Minimal score: {}'.format(minScore))
print('Maximal score: {}'.format(maxScore))
print('Mean score: {}'.format(mean))
print('Percent of games with tile 2048 or more: {}'.format(p2048))
print('Percent of games with tile 4096 or more: {}'.format(p4096))
