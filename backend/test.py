import random
import time

# Number of characters in the sample data
N = 10000


# LZW Compression Function
def compress(data):
    dictionary = {chr(i): i for i in range(256)}
    dict_size = 256
    w = ""
    result = []

    for c in data:
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            result.append(dictionary[w])
            dictionary[wc] = dict_size
            dict_size += 1
            w = c

    if w:
        result.append(dictionary[w])

    return result


# LZW Decompression Function
def decompress(compressed):
    dictionary = {i: chr(i) for i in range(256)}
    dict_size = 256

    w = chr(compressed[0])
    result = w

    for k in compressed[1:]:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[0]

        result += entry
        dictionary[dict_size] = w + entry[0]
        dict_size += 1

        w = entry

    return result


def main():

    # Initialize random seed
    random.seed(int(time.time()))

    # Generate sample data of random uppercase letters
    sample = ""
    for i in range(N):
        sample += chr(ord('A') + random.randint(0, 25))

    # Compress the sample data
    compressed = compress(sample)

    # Decompress the compressed data
    uncompressed = decompress(compressed)

    # Display results
    print("Size of the original data:", len(sample))
    print("Size of the compressed data:", len(compressed))
    print("Size of the decompressed data:", len(uncompressed))
    print()

    # Verify correctness
    if sample == uncompressed:
        print("The original and decompressed data are identical.")
    else:
        print("Error! The data are not identical.")


if __name__ == "__main__":
    main()