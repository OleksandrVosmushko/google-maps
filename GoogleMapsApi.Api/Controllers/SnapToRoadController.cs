using GoogleMapsApi.Entities.Directions.Request;
using GoogleMapsApi.Entities.Roads.SnapToRoads.Request;
using Microsoft.AspNetCore.Mvc;

namespace GoogleMapsApi.Api.Controllers
{
    [Route("snapToRoad")]
    public class SnapToRoadController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<SnapToRoadController> logger;

        public SnapToRoadController( IConfiguration configuration, ILogger<SnapToRoadController> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> GetSnapToRoad([FromBody]SnapToRoadsRequest snapToRoadsRequest)
        {
            try
            {
                snapToRoadsRequest.ApiKey = configuration[Constants.ApiKey];
                var response = await GoogleMaps.SnapToRoads.QueryAsync(snapToRoadsRequest);
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }
    }
}
