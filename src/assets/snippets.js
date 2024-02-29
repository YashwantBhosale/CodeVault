let snippets = [{
    id: 0,
    title: "My card",
    description: "This is a simple html card",
    language: 'html',
    code: `<div class="card">
    <img src="img_avatar.png" alt="Avatar" style="width:100%">
    <div class="container">
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>`
},
{
    id: 1,
    title: "My card",
    description: "This is a simple html card",
    language: 'html',
    code: `<div class="card">
    <img src="img_avatar.png" alt="Avatar" style="width:100%">
    <div class="container">
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>`
},
{
    id: 2,
    title: "My card",
    language: 'html',
    description: "This is a simple html card",
    code: `<div class="card">
    <img src="img_avatar.png" alt="Avatar" style="width:100%">
    <div class="container">
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>`
},
{
    id:3,
    title: 'Quick sort in c',
    language: 'c',
    description: 'Quick sort implementation in c',
    code: `// C program to implement Quick Sort Algorithm 
    #include <stdio.h> 
      
    // Function to swap two elements 
    void swap(int* a, int* b) 
    { 
        int temp = *a; 
        *a = *b; 
        *b = temp; 
    } 
      
    // Partition function 
    int partition(int arr[], int low, int high) 
    { 
      
        // initialize pivot to be the first element 
        int pivot = arr[low]; 
        int i = low; 
        int j = high; 
      
        while (i < j) { 
      
            // condition 1: find the first element greater than 
            // the pivot (from starting) 
            while (arr[i] <= pivot && i <= high - 1) { 
                i++; 
            } 
      
            // condition 2: find the first element smaller than 
            // the pivot (from last) 
            while (arr[j] > pivot && j >= low + 1) { 
                j--; 
            } 
            if (i < j) { 
                swap(&arr[i], &arr[j]); 
            } 
        } 
        swap(&arr[low], &arr[j]); 
        return j; 
    } 
      
    // QuickSort function 
    void quickSort(int arr[], int low, int high) 
    { 
        if (low < high) { 
      
            // call Partition function to find Partition Index 
            int partitionIndex = partition(arr, low, high); 
      
            // Recursively call quickSort() for left and right 
            // half based on partition Index 
            quickSort(arr, low, partitionIndex - 1); 
            quickSort(arr, partitionIndex + 1, high); 
        } 
    } 
      
    // driver code 
    int main() 
    { 
        int arr[] = { 19, 17, 15, 12, 16, 18, 4, 11, 13 }; 
        int n = sizeof(arr) / sizeof(arr[0]); 
      
        // printing the original array 
        printf("Original array: "); 
        for (int i = 0; i < n; i++) { 
            printf("%d ", arr[i]); 
        } 
      
        // calling quickSort() to sort the given array 
        quickSort(arr, 0, n - 1); 
      
        // printing the sorted array 
        printf("\nSorted array: "); 
        for (int i = 0; i < n; i++) { 
            printf("%d ", arr[i]); 
        } 
      
        return 0; 
    }`
}

]

export default snippets;