let resultsContainer = document.getElementById("realWorldResults");
let rootPath = "videos/full-run";
let transparentize = (color, opacity) => {
	var alpha = opacity === undefined ? 0.5 : 1 - opacity;
	return Color(color).alpha(alpha).rgbString();
}
let animateBox = false;
let animSpeed = 0.1;
let colors = ['#ff6361', '#003f5c', '#ffa600', '#45B39D'];
let pad = false;
let lerp = (v0, v1, t) => {
	return v0 * (1 - t) + v1 * t
}
let range = (start, stop, step) => {
	if (typeof stop == 'undefined') {
		// one param defined
		stop = start;
		start = 0;
	}

	if (typeof step == 'undefined') {
		step = 1;
	}

	if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
		return [];
	}

	var result = [];
	for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
		result.push(i);
	}

	return result;
};
// Chart.defaults.global.defaultFontSize = 12;
// let createCoveragePlot = (ctx, datasets, videoId, steps, showLegend = false) => {
// 	labels = pad ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : range(0, datasets[0].data.length - 1);
// 	labels.unshift('Init');
// 	let setupVideo = document.getElementById(`${videoId}`);
// 	showLegend = datasets.length > 1;
// 	let config = {
// 		type: 'line',
// 		data: {
// 			labels: labels,
// 			datasets: datasets
// 		},
// 		options: {
// 			legend: {
// 				display: showLegend
// 			},
// 			layout: {
// 				padding: {
// 					left: 0,
// 					right: 0,
// 					top: 20,
// 					bottom: 0
// 				}
// 			},
// 			tooltips: {
// 				enabled: true,
// 				mode: 'nearest',
// 				intersect: false
// 			},
// 			maintainAspectRatio: false,
// 			spanGaps: false,
// 			elements: {
// 				line: {
// 					tension: 0.000001
// 				}
// 			},
// 			plugins: {
// 				filler: {
// 					propagate: false
// 				},
// 				annotation: {
// 					drawTime: 'afterDatasetsDraw',
// 					dblClickSpeed: 350,
// 					annotations: [{
// 						drawTime: 'afterDraw',
// 						display: true,
// 						type: 'box',
// 						scaleID: 'y',
// 						value: '25',
// 						borderColor: 'red',
// 						borderWidth: 2
// 					}]
// 				}
// 			},
// 			scales: {
// 				xAxes: [{
// 					ticks: {
// 						autoSkip: false,
// 						maxRotation: 0,
// 						padding: 0,
// 					},
// 					scaleLabel: {
// 						display: true,
// 						labelString: "Episode Steps"
// 					}
// 				}],
// 				yAxes: [{
// 					ticks: {
// 						beginAtZero: false,
// 						stepSize: 0.2,
// 						suggestedMax: 1.0,
// 						suggestedMin: 0.1,
// 						padding: 0,
// 					},
// 					scaleLabel: {
// 						display: true,
// 						labelString: "Coverage (%)"
// 					}
// 				}]
// 			},
// 			responsive: false,
// 			annotation: {
// 				annotations: [{
// 					type: 'box',
// 					events: [],
// 					display: true,
// 					drawTime: 'afterDatasetsDraw',
// 					xScaleID: 'x-axis-0',
// 					yScaleID: 'y-axis-0',
// 					xMin: -2,
// 					xMax: -1,
// 					yMax: 1,
// 					yMin: 0,
// 					borderColor: 'grey',
// 					borderWidth: 0,
// 					backgroundColor: transparentize('grey', 0.7),
// 					cornerRadius: 0
// 				}]
// 			},
// 			onClick: function (e, a) {
// 				// Move video to x axis step clicked
// 				let step = this.chart.scales['x-axis-0'].getValueForPixel(e.offsetX);
// 				let time = steps[step].start;
// 				// decode to time
// 				setupVideo.currentTime = time;
// 				topVideo.currentTime = time;
// 			},
// 			onHover: (e) => {
// 				e.target.style.cursor = 'pointer';
// 			}
// 		}
// 	};
// 	let chart = new Chart(ctx, config);
// 	chart.video = setupVideo;
// 	chart.steps = steps;
// 	chart.step = -1;
// 	return chart;
// };

let addResults = (collection, parentNode = resultsContainer) => {
	collection.forEach(item => {
		let container = document.createElement("div");
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.margin = "5px";
		container.style.position = "relative";
		// container.style.width = "380px";
		container.style.width = "420px";
		let expPath = item.path;
		// let coverages = item.coverages;
		// while (coverages.length < 10 && pad) {
		// 	coverages.push(coverages[coverages.length - 1]);
		// }

		let color = item.color;
		let steps = item.steps;
		let itemId = expPath.replaceAll("/", "-");
		let canvasId = `${itemId}-canvas`;
		let videoId = `${itemId}-video`;
		// container.insertAdjacentHTML("beforeend", `<video id="${videoId}-setup" width=380px autoplay loop muted><source src="${rootPath}/${expPath}/setup.mp4" type="video/mp4"> </video> <video id="${videoId}-top" style="position: absolute; top:135px;" height=150px autoplay loop muted> <source src="${rootPath}/${expPath}/top.mp4" type="video/mp4"> </video> <canvas id="${canvasId}" height="200px" width="380px"></canvas>`);
		container.insertAdjacentHTML("beforeend", `<video id="${videoId}-setup" width=420px autoplay loop muted><source src="${rootPath}/${expPath}/setup.mp4" type="video/mp4"> </video> <video id="${videoId}-top" style="position: absolute; top:116px;" height=120px autoplay loop muted>  <source src="${rootPath}/${expPath}/top.mp4" type="video/mp4"> </video><p style="position:absolute; top: 195px; left: 5px;color: #fff; font-weight: 400;"></p> <canvas id="${canvasId}" height="180px" width="420px"></canvas>`);
		parentNode.appendChild(container);
		// let chart = createCoveragePlot(
		// 	document.getElementById(canvasId).getContext('2d'),
		// 	[{
		// 		backgroundColor: transparentize(color, 0.6),
		// 		borderColor: color,
		// 		data: coverages,
		// 		label: 'Fling',
		// 		fill: 'start'
		// 	}],
		// 	videoId, steps
		// );
		let setupVideo = document.getElementById(`${videoId}-setup`);
		let topVideo = document.getElementById(`${videoId}-top`);
		setupVideo.ontimeupdate = () => {
			topVideo.currentTime = setupVideo.currentTime;
			if (steps != undefined) {
				// find current step
				for (let i = 0; i < steps.length; ++i) {
					if (steps[i].start < setupVideo.currentTime && steps[i].end > setupVideo.currentTime) {
						// currently at ith step
						if (chart.step == i) {
							break;
						}
						chart.step = i;
						if (animateBox) {
							// Slows down after a while, need to look into this
							chart.animId = setInterval(() => {
								let box = chart.options.annotation.annotations[0];
								box.xMin = lerp(box.xMin, chart.step - 1, animSpeed);
								box.xMax = lerp(box.xMax, chart.step, animSpeed);
								if (Math.abs(box.xMin - chart.step - 1) > 0.001) {
									chart.update();
								} else {
									clearInterval(chart.animId);
								}
							}, 5);
						} else {
							let box = chart.options.annotation.annotations[0];
							box.xMin = chart.step - 1;
							box.xMax = chart.step;
							chart.update()
						}
						break
					}
				}
			}
		}
	});
};


function updateVideoSpeed(speed) {
	// print("updating video speedddd")
	console.log("updating video speedddd")
	let vids = document.getElementsByTagName('video');
	// vids is an HTMLCollection
	for (let i = 0; i < vids.length; i++) {
		if (vids.item(i).id != '1x_speed'){
			vids.item(i).playbackRate = speed;
		}
	}
}