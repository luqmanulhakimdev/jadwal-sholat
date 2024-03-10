<template>
	<div class="relative bg-white overflow-hidden my-20 mx-auto max-w-7xl">
		<div class="flex flex-col">
		  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
		      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

				<div class="my-5">
					<p v-if="jadwal.daerah && jadwal.lokasi" class ="text-4xl my-2">{{ capitalize(jadwal.daerah) }}, {{ capitalize(jadwal.lokasi) }}</p>
					<p v-if="jadwal.jadwal" class="text-2xl">{{ jadwal.jadwal.tanggal }}</p>

					<form @submit.prevent="onSubmit">
						<input type="date" class="absolute top-11 right-0" @input="onSubmit" v-model="form.date">
					</form>
					
				</div>

		        <table class="min-w-full divide-y divide-gray-200">
		          <tbody class="bg-white divide-y divide-gray-200">
					<tr>
						<th v-for="item in whitelist_column" class="px-6 py-4 w-1/12">
							<span class="capitalize">{{ item }}</span>
						</th>
					</tr>
					
					<tr :key="key">
						<template v-for="(item, key) in jadwal.jadwal">
							<td class="px-6 py-4 w-1/12 text-center" v-if="checkColumn(key)">
								{{ item }}
							</td>
						</template>
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
import moment from 'moment'
export default {
  	name: 'MainJadwal',
  	data () {
	    return {
			id: 0,
			date: '',
			jadwal: {},
			whitelist_column: [
				'imsak', 'subuh', 'terbit', 'dhuha', 'dzuhur', 'ashar', 'maghrib', 'isya'
			],
			form: {
				date: ""
			},
	    }
	},
	created () {
		this.id = this.$route.params.id
		this.date = moment().format("YYYY-MM-DD")
	    axios
			// date format: 2024-06-23
	      	.get('https://api.myquran.com/v2/sholat/jadwal/'+this.$route.params.id+'/'+this.date)
	      	.then(response => (this.jadwal = response.data.data))
	},
	methods: {
		checkColumn(column) {
			return this.whitelist_column.includes(column)
		},
		capitalize(string) {
			return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
		},
		onSubmit() {
			axios
				// date format: 2024-06-23
				.get('https://api.myquran.com/v2/sholat/jadwal/'+this.$route.params.id+'/'+this.form.date)
				.then(response => (this.jadwal = response.data.data))
		}
	}
}
</script>