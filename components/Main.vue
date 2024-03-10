<template>
	<div class="relative bg-white overflow-hidden my-20 mx-auto max-w-7xl">
		<div class="flex flex-col">
		  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
		      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
				<form class="flex items-center max-w-full my-5" @submit.prevent="onSubmit">   
					<label for="simple-search" class="sr-only">Search</label>
					<div class="relative w-full">
						<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
								<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
							</svg>
						</div>
						<input type="text" v-model="form.search" id="simple-search" class="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:border-gray-600 dark:placeholder-gray-400" placeholder="Search city..." required />
					</div>
					<button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-indigo-600 rounded-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800">
						<svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
						</svg>
						<span class="sr-only">Search</span>
					</button>
				</form>

		        <table class="min-w-full divide-y divide-gray-200">
		          <thead class="bg-gray-50">
		            <tr>
		              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
		                No
		              </th>
		              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/7">
		                Kota
		              </th>
		            </tr>
		          </thead>
		          <tbody class="bg-white divide-y divide-gray-200">
		            <tr v-for="(item, index) in city" :key="item.id">
		              <td class="px-6 py-4 w-1/5">
		                {{ ++index }}
		              </td>
		              <td class="px-6 py-4 w-2/7">
		                <div class="text-sm text-gray-900">
		                	<NuxtLink :to="`/city/${item.id}`">{{ item.lokasi }}</NuxtLink>
		                </div>
		              </td>
		            </tr>
		          </tbody>
		        </table>
		      </div>
		    </div>
		  </div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
export default {
  	name: 'Main',
  	data () {
	    return {
			form: {
				search: ""
			},
	      	city: []
	    }
	},
	mounted () {
	    axios
	      .get('https://api.myquran.com/v2/sholat/kota/semua')
	      .then(response => (this.city = response.data.data))
	},
	methods: {
		onSubmit() {
			axios
				.get('https://api.myquran.com/v2/sholat/kota/cari/'+this.form.search)
				.then(response => (this.city = response.data.data))
		}
	}
}
</script>