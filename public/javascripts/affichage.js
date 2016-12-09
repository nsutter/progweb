
function visibilite(aff)
{
  if($("#" + aff).css("display") == "none")
  {
    $("#" + aff).css("display", "block");
  }
  else
  {
    $("#" + aff).css("display", "none");
  }
}
