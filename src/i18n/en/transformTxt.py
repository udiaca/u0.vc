#!/usr/bin/env python3

"""
this file/dir is a temporary hack until I figure out how to run sqlite
in Cloudflare, or until I get access to their D1 product offering

converts files like:

  uber super; very high-level.
  ultimate greatest possible; most extreme; maximum; farthest; utmost; fundamental.
  ultra extremely excellent or good; extreme; far beyond the norm or casual.
  ultraprecise extremely precise, specific, detailed or exact.

to files like:

  const u = [
    "uber", // super; very high-level.
    "ultimate", // greatest possible; most extreme; maximum; farthest; utmost; fundamental.
    "ultra", // extremely excellent or good; extreme; far beyond the norm or casual.
    "ultraprecise", // extremely precise, specific, detailed or exact.
  ]
"""

from os import path, walk

def main():
  # get directory
  dir_path = path.dirname(path.realpath(__file__))

  filenames = next(walk(dir_path), (None, None, []))[2]  # [] if no files
  filenames = [filename for filename in filenames if filename.endswith(".txt")]
  print(filenames)

  for filename in filenames:
    file_name, _ext = path.splitext(filename)
    file_out = open(path.join(dir_path, file_name + ".ts"), "w")
    letter = file_name.split("-")[0]
    file_out.write(f"const {letter} = [\n")
    with open(path.join(dir_path, filename), 'r') as f:
      for line in f.readlines():
        splits = line.split()
        if len(splits) > 1:
          word, *rest = splits
        elif len(splits) == 1:
          word = splits[0]
          rest = []

        word_def = " ".join(rest)
        # print(word, word_def)
        # file_out.writelines([f"\"{word}\": \"{word_def}\",\n"])
        file_out.write(f"  \"{word}\"," + (f" // {word_def}" if len(word_def) else "") + "\n")
      file_out.write(f"]\n")
    file_out.close()

if __name__ == '__main__':
  main()
