using GoogleMapsApi.Entities.Directions.Request;
using Microsoft.AspNetCore.Mvc;

namespace GoogleMapsApi.Api.Controllers
{
    [Route("directions")]
    public class DirectionsController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<DirectionsController> logger;

        public DirectionsController( IConfiguration configuration, ILogger<DirectionsController> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> GetDirections(DirectionsRequest directionsRequest)
        {
            try
            {
                directionsRequest.ApiKey = configuration[Constants.ApiKey];
                var response =  await GoogleMaps.Directions.QueryAsync(directionsRequest);
                return Ok(response);
            } catch (Exception ex)
            {
                logger.LogError(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }
    }
}
