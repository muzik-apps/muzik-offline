import subprocess
import psutil
import time
import os
from tabulate import tabulate

# Define the commands
commands = [
    ["audiowaveform.exe", "-i", "intro.mp3", "-o", "intro.dat", "-b", "8", "--pixels-per-second", "10"],
    ["audiowaveform.exe", "-i", "place.mp3", "-o", "place.dat", "-b", "8", "--pixels-per-second", "10"],
    ["audiowaveform.exe", "-i", "WEST.mp3", "-o", "WEST.dat", "-b", "8", "--pixels-per-second", "10"],
]

# Number of times each command should be run for aggregation
NUM_RUNS = 10

# Function to execute a command and measure time and memory usage
def run_command_with_metrics(command):
    start_time = time.time()
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    pid = process.pid
    
    try:
        # Monitor memory usage
        max_memory_usage = 0
        min_memory_usage = float('inf')  # to track the minimum memory usage
        while process.poll() is None:
            try:
                memory_usage = psutil.Process(pid).memory_info().rss / 1024 / 1024  # MB
                max_memory_usage = max(max_memory_usage, memory_usage)
                min_memory_usage = min(min_memory_usage, memory_usage)
            except psutil.NoSuchProcess:
                break
            time.sleep(0.1)
        
        # Wait for the process to complete
        stdout, stderr = process.communicate()
        end_time = time.time()

        return {
            "stdout": stdout.decode("utf-8"),
            "stderr": stderr.decode("utf-8"),
            "time_elapsed": end_time - start_time,
            "max_memory_usage": max_memory_usage,
            "min_memory_usage": min_memory_usage
        }
    except Exception as e:
        process.terminate()
        return {"error": str(e)}

# Function to run the commands multiple times and aggregate the results
def run_and_aggregate(commands, num_runs=NUM_RUNS):
    aggregated_results = []

    for command in commands:
        command_results = {"command": ' '.join(command), "time_elapsed": [], "max_memory_usage": [], "min_memory_usage": []}
        
        print(f"Running command: {' '.join(command)}")
        for _ in range(num_runs):
            metrics = run_command_with_metrics(command)
            
            if "error" in metrics:
                print(f"Error occurred: {metrics['error']}")
                continue
            
            command_results["time_elapsed"].append(metrics["time_elapsed"])
            command_results["max_memory_usage"].append(metrics["max_memory_usage"])
            command_results["min_memory_usage"].append(metrics["min_memory_usage"])
        
        print(f"Command completed: {' '.join(command)}")
        aggregated_results.append(command_results)
    
    return aggregated_results

# Function to calculate averages and bounds
def calculate_stats(aggregated_results):
    stats = []
    
    for result in aggregated_results:
        avg_time = sum(result["time_elapsed"]) / len(result["time_elapsed"])
        avg_max_mem = sum(result["max_memory_usage"]) / len(result["max_memory_usage"])
        avg_min_mem = sum(result["min_memory_usage"]) / len(result["min_memory_usage"])
        
        time_upper_bound = max(result["time_elapsed"])
        time_lower_bound = min(result["time_elapsed"])
        
        mem_upper_bound = max(result["max_memory_usage"])
        mem_lower_bound = min(result["max_memory_usage"])
        
        stats.append({
            "command": result["command"],
            "avg_time_seconds": avg_time,
            "time_upper_bound": time_upper_bound,
            "time_lower_bound": time_lower_bound,
            "avg_max_mem_mb": avg_max_mem,
            "mem_upper_bound": mem_upper_bound,
            "mem_lower_bound": mem_lower_bound,
            "avg_min_mem_mb": avg_min_mem
        })
    
    return stats

# Function to write the results to a file
def write_stats_to_file(stats):
    # Determine the next available file name
    run_number = 1
    while os.path.exists(f"run{run_number}.txt"):
        run_number += 1
    
    filename = f"run{run_number}.txt"
    
    # Prepare the table
    table = []
    for stat in stats:
        table.append([
            stat["command"],
            f"{stat['avg_time_seconds']:.2f}",
            f"{stat['time_upper_bound']:.2f}",
            f"{stat['time_lower_bound']:.2f}",
            f"{stat['avg_max_mem_mb']:.2f}",
            f"{stat['mem_upper_bound']:.2f}",
            f"{stat['mem_lower_bound']:.2f}",
            f"{stat['avg_min_mem_mb']:.2f}",
        ])
    
    # Table header
    headers = ["Command", "Avg Time (s)", "Time Upper Bound", "Time Lower Bound", "Avg Max Mem (MB)", "Mem Upper Bound", "Mem Lower Bound", "Avg Min Mem (MB)"]
    
    # Write to file
    with open(filename, "w", encoding="utf-8") as f:
        f.write(tabulate(table, headers=headers, tablefmt="fancy_grid"))
    
    print(f"Results saved to {filename}")

# Run the commands and aggregate the results
aggregated_results = run_and_aggregate(commands)

# Calculate the statistics (averages and bounds)
stats = calculate_stats(aggregated_results)

# Write the stats to a new file
write_stats_to_file(stats)
