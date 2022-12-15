#!/usr/bin/env python3
# Beacon Exclusion Zone
# https://adventofcode.com/2022/day/15

from collections import namedtuple
from os import path

Sensor = namedtuple("Sensor", ["sensor_pos", "nearest_beacon_pos", "nearest_beacon_dist"])


use_example = False
# use_example = True
print_verbose_val = False
# print_verbose_val = True

intersection_row = 2000000  # input
if use_example:
    intersection_row = 10  # example


def print_verbose(val):
    if print_verbose_val:
        print(val)


def read_and_parse_input():
    # read input file into memory
    script_dir = path.dirname(path.abspath(__file__))
    input_path = path.join(script_dir, "input.txt")
    if use_example:
        input_path = path.join(script_dir, "example.txt")
    with open(input_path) as file:
        data_lines = file.readlines()

    data = []

    prefix_sensor = "Sensor at x="
    prefix_beacon = "closest beacon is at x="

    for data_line in data_lines:
        data_line = data_line.strip()

        sensor_raw, beacon_raw = data_line.split(": ")
        sensor_pos_x, sensor_pos_y = sensor_raw[len(prefix_sensor) :].split(", y=")
        beacon_pos_x, beacon_pos_y = beacon_raw[len(prefix_beacon) :].split(", y=")

        sensor_pos = (int(sensor_pos_x), int(sensor_pos_y))
        nearest_beacon_pos = (int(beacon_pos_x), int(beacon_pos_y))
        nearest_beacon_dist = manhattan_distance(sensor_pos, nearest_beacon_pos)

        data.append(
            Sensor(
                sensor_pos=sensor_pos,
                nearest_beacon_pos=nearest_beacon_pos,
                nearest_beacon_dist=nearest_beacon_dist,
            )
        )

    return data


def manhattan_distance(posA, posB):
    deltas = [v[0] - v[1] for v in zip(posA, posB)]
    abs_deltas = [abs(v) for v in deltas]
    return sum(abs_deltas)


def print_grid(grid, world_boundary_x_y, sensor = None):
    (world_min_x, world_max_x, world_min_y, world_max_y) = world_boundary_x_y
    for row_idx in range(world_min_y, world_max_y):
        print_row = []
        for col_idx in range(world_min_x, world_max_x):
            val = grid.get((col_idx, row_idx), ".")
            if sensor is None or val != ".":
                print_row.append(val)
                continue

            cell_dist = manhattan_distance((col_idx, row_idx), sensor.sensor_pos)
            if cell_dist <= sensor.nearest_beacon_dist:
                val = "#"
            print_row.append(val)

        grid_row = "".join(print_row)
        grid_row_with_row_idx = f"{row_idx:<3} {grid_row}"
        if row_idx == intersection_row:
            grid_row_with_row_idx = f"{grid_row_with_row_idx} <~~"
        print(grid_row_with_row_idx)


def main():
    data = read_and_parse_input()

    world_min_x = float("inf")
    world_min_y = float("inf")
    world_max_x = -float("inf")
    world_max_y = -float("inf")

    # origin (0, 0) is top left. increase x to right, increase y to down
    grid = {}

    # preprocess to get boundaries
    for sensor in data:
        [sensor_x, sensor_y] = sensor.sensor_pos
        [beacon_x, beacon_y] = sensor.nearest_beacon_pos

        world_min_x = min(sensor_x - sensor.nearest_beacon_dist, beacon_x, world_min_x)
        world_min_y = min(sensor_y - sensor.nearest_beacon_dist, beacon_y, world_min_y)
        world_max_x = max(sensor_x + sensor.nearest_beacon_dist, beacon_x, world_max_x)
        world_max_y = max(sensor_y + sensor.nearest_beacon_dist, beacon_y, world_max_y)

        grid[(sensor_x, sensor_y)] = "S"
        grid[(beacon_x, beacon_y)] = "B"

    world_max_x += 1
    world_max_y += 1

    world_boundary_x_y = (world_min_x, world_max_x, world_min_y, world_max_y)
    # print_verbose(f"world_min_xy: {world_min_x, world_min_y}, world_max_xy: {world_max_x, world_max_y}")
    # print_verbose(f"world_min_max_x: {world_min_x, world_max_x}, world_min_max_y: {world_min_y, world_max_y}")
    if use_example:
        print_grid(grid, world_boundary_x_y)
        # print_grid(grid, world_boundary_x_y, data[6])

    counter = 0

    for sensor_idx, sensor in enumerate(data):
        print(f"Analyzing sensor {sensor_idx + 1} / {len(data)} at {sensor}")
        sensor_pos = sensor.sensor_pos
        sensor_x, sensor_y = sensor.sensor_pos
        nearest_beacon_dist = sensor.nearest_beacon_dist

        # can this beacon detect the intersection row at all?
        dist_to_row = abs(sensor_pos[1] - intersection_row)
        print_verbose(
            f"Beacon distance: {nearest_beacon_dist}, Row distance: {dist_to_row}"
        )
        if dist_to_row > nearest_beacon_dist:
            print_verbose("skip: cannot reach intersection row")
            continue

        if use_example:
            # print_grid(grid, world_boundary_x_y)
            print_grid(grid, world_boundary_x_y, sensor)

        cur_height = intersection_row

        # determine number of cells in row
        num_row_cells = 1 + (abs(abs(cur_height - sensor_y) - nearest_beacon_dist) * 2)
        print_verbose(f"row: {cur_height}, num_row_cells: {num_row_cells}")

        # fill in current sensor column
        spot_pos = (sensor_x, cur_height)
        spot_val = grid.get(spot_pos, ".")
        if spot_val == ".":
            grid[spot_pos] = "~"
            counter += 1

        # fill in current row to right:
        for col_idx in range(sensor_x + 1, sensor_x + 1 + abs(abs(cur_height - sensor_y) - nearest_beacon_dist)):
            spot_pos = (col_idx, cur_height)
            spot_val = grid.get(spot_pos, ".")
            if spot_val == ".":
                grid[spot_pos] = "~"
                counter += 1

        # fill in current row to left:
        for col_idx in range(sensor_x - 1, sensor_x - 1 - abs(abs(cur_height - sensor_y) - nearest_beacon_dist), -1):
            spot_pos = (col_idx, cur_height)
            spot_val = grid.get(spot_pos, ".")
            if spot_val == ".":
                grid[spot_pos] = "~"
                counter += 1

    print(counter)


if __name__ == "__main__":
    main()
