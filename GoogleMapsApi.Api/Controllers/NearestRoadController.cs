using GoogleMapsApi.Entities.Roads.NearestRoads.Request;
using Microsoft.AspNetCore.Mvc;

namespace GoogleMapsApi.Api.Controllers
{
    [Route("nearestRoad")]
    public class NearestRoadController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<NearestRoadController> logger;

        public NearestRoadController(IConfiguration configuration, ILogger<NearestRoadController> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> GetSnapToRoad([FromBody] NearestRoadsRequest snapToRoadsRequest)
        {
            try
            {
                snapToRoadsRequest.ApiKey = configuration[Constants.ApiKey];
                var response = await GoogleMaps.NearestRoads.QueryAsync(snapToRoadsRequest);
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
