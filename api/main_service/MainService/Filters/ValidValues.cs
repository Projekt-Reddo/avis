using System.ComponentModel.DataAnnotations;
namespace MainService.Filters;

public class ValidValues : ValidationAttribute
{
	Type _validateType;

	public ValidValues(Type validateType)
	{
		_validateType = validateType;
	}

	protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
	{
		if (value is null)
		{
			return ValidationResult.Success;
		}

		var inputValue = (string)value;
		var isValid = false;
		var validValues = new List<String>();
		foreach (var property in _validateType.GetFields())
		{
			if (!String.IsNullOrWhiteSpace(inputValue))
			{
				var fieldValue = (property.GetValue(null) ?? "").ToString();
				validValues.Add(fieldValue!);
				if (inputValue.ToLower() == (property.GetValue(null) ?? "").ToString()!.ToLower())
				{
					isValid = true;
				}
			}
		}

		if (isValid)
		{
			return ValidationResult.Success;
		}

		return new ValidationResult($"The value must be one of {String.Join(", ", validValues)}");
	}
}