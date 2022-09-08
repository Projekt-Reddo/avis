using MainService.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Utils;

public class ModelStateValidator
{
    public static IActionResult ValidateModelState(ActionContext context)
    {
        var rs = new ResponseDto()
        {
            Status = 400,
            Message = "Input values are invalid",
            Errors = context.ModelState.Where(input => input.Value!.Errors.Count() > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                )
        };

        return new BadRequestObjectResult(rs);
    }
}