$(document).ready(function () {
  var $pagination = $("#pagination"),
    totalRecords = 0,
    records = [],
    recPerPage = 0,
    nextPageToken = "",
    totalPages = 0;
  var search = "";
  var maxResults=6;

$("#myForm").submit(function (e) {
  e.preventDefault();

  search = $("#search").val();

  fetchVideos(search);

});

const fetchVideos = async (search) => {
  const url = `/api?q=${search}&part=snippet&maxResults=${maxResults}&pageToken=${nextPageToken}&type=video`;

  const res = await fetch(url)
  const data = await res.json()

  $("#videos").empty();
  displayVideos(data);
}

function apply_pagination() {
  $pagination.twbsPagination({
    totalPages: totalPages,
    visiblePages: 6,
    onPageClick: function (event, page) {
      displayRecordsIndex = Math.max(page - 1, 0) * recPerPage;
      endRec = displayRecordsIndex + recPerPage;
      displayRecords = records.slice(displayRecordsIndex, endRec);
      generateRecords(recPerPage, nextPageToken);
    },
  });
}

$("#search").change(function () {
  search = $("#search").val();
});

function generateRecords(recPerPage, nextPageToken) {
// Fetch  data from API
    fetchVideos(search);
}

// Add display data to DOM
function displayVideos(data) {
  recPerPage = data.pageInfo.resultsPerPage;
  nextPageToken = data.nextPageToken;
  totalRecords = data.pageInfo.totalResults;
  totalPages = Math.ceil(totalRecords / recPerPage);
  apply_pagination();
  $("#search").val();

  var videoData = "";

  $("#table").show();

  data.items.forEach((item) => {
    videoData = `
    <iframe width="350" height="250" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
    <button id=${item.id.videoId} class="btn btn-primary" style="position: absolute; margin-left: -60px; margin-top: 5px">Use</button>
    `
    $("#videos").append(videoData)
    //copying video id on button click to the field
    let videoId = item.id.videoId
    $(`#${videoId}`).click(function () {
        $("#youtube_input").val(`${videoId}`);
        showVideo(videoId,400,300); 
        CustomElement.setValue(videoId);
    });
  });
}
});

