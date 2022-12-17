#!/usr/bin/env python3
# Hill Climbing Algorithm, part 2
# https://adventofcode.com/2022/day/12

from os import path
from queue import Queue

def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    # input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    # Parse file into workable input
    # top left is (0, 0), top right is (0, col), bottom right is (row, col)
    grid_heights = []
    lowest_positions = []
    highest_position = (0, 0)
    for row_idx, data_line in enumerate(data_lines):
        data_line = tuple(data_line.strip())
        data_heights = []
        for col_idx, raw_height in enumerate(data_line):
            height = -1
            if raw_height == "S" or raw_height == "a":
                height = 1
                lowest_positions.append((row_idx, col_idx))
            elif raw_height == "E":
                height = 26
                highest_position = (row_idx, col_idx)
            else:
                height = ord(raw_height) - 96
            data_heights.append(height)
        grid_heights.append(tuple(data_heights))

    return (tuple(grid_heights), lowest_positions, highest_position)


def get_movable_to_position(grid, position):
    """
    Given a position within a grid, return all neighbors that can move into position
    """
    moves = []

    cur_row, cur_col = position
    cur_height = grid[cur_row][cur_col]

    # can move from up position
    up_row = cur_row - 1
    if up_row >= 0 and grid[up_row][cur_col] >= cur_height - 1:
        moves.append((up_row, cur_col))
    # can move from down position
    down_row = cur_row + 1
    if down_row < len(grid) and grid[down_row][cur_col] >= cur_height - 1:
        moves.append((down_row, cur_col))
    # can move from left position
    left_col = cur_col - 1
    if left_col >= 0 and grid[cur_row][left_col] >= cur_height - 1:
        moves.append((cur_row, left_col))
    # can move from right position
    right_col = cur_col + 1
    if right_col < len(grid[0]) and grid[cur_row][right_col] >= cur_height - 1:
        moves.append((cur_row, right_col))

    return moves


def dijkstra(grid, start):
    dist = dict()
    queue = Queue()

    # distance from start to start is set to 0
    dist[start] = []
    queue.put(start)

    while not queue.empty():
        position = queue.get()
        print(f"==== current position {position}")
        position_dist = dist[position]
        position_moves = get_movable_to_position(grid, position)

        for position_move in position_moves:
            move_dist = dist.get(position_move, None)
            print(f" === neighbor {position_move}, dist {move_dist}")
            if move_dist is None or len(move_dist) > (len(position_dist) + 1):
                move_dist = position_dist + [position_move]
                queue.put(position_move)
            dist[position_move] = move_dist
        queue.task_done()

    return dist


def main():
    grid, lowest_positions, highest_position = read_and_parse_input()
    dist = dijkstra(grid, highest_position)
    print(dist)

    min_path = None
    for lowest_position in lowest_positions:
        cur_lowest_position_path = dist.get(lowest_position)
        if cur_lowest_position_path is None:
            continue
        if min_path is None or len(cur_lowest_position_path) < len(min_path):
            min_path = cur_lowest_position_path
    print(min_path)
    print(len(min_path))

if __name__ == "__main__":
    main()
