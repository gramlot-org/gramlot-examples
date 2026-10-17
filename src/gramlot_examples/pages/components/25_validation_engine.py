from datetime import date

from gramlot import Page as BasePage, endpoint


class Page(BasePage):
    title = "Validation rules and callbacks"
    devices = ("desktop", "tablet", "phone")
    css = ("/themes/gramlot-base/theme.css",)

    def main(self, root):
        pane = root.main(class_="example-page stack")
        pane.h1("Validation playground")
        pane.p("Leave a field to validate it. Invalid drafts stay visible; the accepted values below change only after success.")
        group = pane.groupBox(id="validation-group", datapath="profile", copy=True, lbl="Profile · field validations", max_width="36rem")
        fields = group.formlet(id="validation-fields", lbl_position="L", box_c_width="100%")
        fields.textbox(id="full-name", value="^.full_name", lbl="Name (2–30)",
                       validate_notnull=True, validate_len="2:30",
                       validate_notnull_error="Please enter a name.", validate_len_error="Use 2–30 characters.")
        fields.textbox(id="code", value="^.code", lbl="Code (2–6 letters)", validate_case="upper",
                      validate_regex="(?:^[A-Z]{2,6}$)", validate_regex_error="Use 2–6 letters.")
        fields.textbox(id="fallback", value="^.fallback", lbl="Empty becomes Guest", validate_empty="Guest")
        fields.numberTextBox(id="quantity", value="^.quantity", lbl="Quantity: 0–10", validate_min=0, validate_max=10)
        fields.checkbox(id="strict", value="^.strict", lbl="Email", label="Make the warning blocking")
        fields.textbox(id="email", value="^.email", lbl="Email format", validate_email=True,
                        validate_email_iswarning="^.strict:=!{}")
        fields.checkbox(value="^.check_length", lbl="Length", label="Require at least four characters")
        fields.textbox(id="conditional", value="^.conditional", lbl="Conditional length", validate_len="4:",
                        validate_len_if="enabled", validate_enabled="^.check_length")
        fields.textbox(id="nickname", value="^.nickname", lbl="Nickname",
                       validate_call="checkNickname", validate_onAccept="accepted", validate_onReject="rejected")
        fields.textbox(id="remote-name", value="^.remote_name", lbl="Remote name",
                       validate_remote="check_name", validate_timeout=5000)
        fields.textBoxArea(id="notes", value="^.notes", lbl="Notes (max 40)", rows=2,
                           validate_len=":40", validate_len_error="Use at most 40 characters.")
        fields.dateTextBox(id="appointment", value="^.appointment", lbl="Appointment", format="short",
                           validate_notnull=True, validate_notnull_error="Choose a date or type a date expression.")
        fields.filteringSelect(id="delivery", value="^.delivery", lbl="Delivery",
                               values="standard:Standard,express:Express,pickup:Pick up", validate_notnull=True,
                               validate_notnull_error="Choose a delivery option.")
        group.p("Try an empty name, quantity 11, a malformed email, or a long note. The local callback rejects admin; the asynchronous endpoint rejects taken.")
        accepted = pane.details(max_width="36rem", open=True)
        accepted.summary("Accepted Data · invalid drafts do not overwrite these values")
        values = accepted.dl()
        for label, path in (("Name", "full_name"), ("Code", "code"), ("Quantity", "quantity"),
                            ("Email", "email"), ("Notes", "notes"), ("Delivery code", "delivery"),
                            ("Remote name", "remote_name")):
            values.dt(label)
            values.dd("^profile." + path, id={"code": "code-result", "email": "email-result",
                                     "remote_name": "remote-result"}.get(path))
        values.dt("Appointment")
        values.dd("^profile.appointment", format="short")
        accepted.p("^profile.validation_status", id="validation-status")
        for path, value in (("full_name", "Ada Lovelace"), ("notes", "Please ring the bell."),
                            ("appointment", date(2026, 10, 17)), ("delivery", "standard"), ("code", "AB"), ("fallback", "Guest"), ("quantity", 2), ("email", ""),
                            ("strict", False), ("check_length", False), ("conditional", "Ada"),
                            ("nickname", "Ada"), ("remote_name", "AVAILABLE"), ("validation_status", "Edit a nickname.")):
            pane.dataSetter("profile." + path, value)

    @endpoint
    def check_name(self, value: str):
        if value.lower() == "taken":
            return {"errorcode": "reserved", "message": "That name is reserved."}
        return {"value": value.upper()}
