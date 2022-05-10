import {expect} from "chai";
import {castValue, SettingType, settingTypeFromString} from "../../model/setting";

describe("Setting", () => {
  describe("settingTypeFromString", () =>{
      it("should return the correct type from string", () => {
          expect(settingTypeFromString("boolean")).to.be.eq(SettingType.Boolean);
          expect(settingTypeFromString("number")).to.be.eq(SettingType.Number);
          expect(settingTypeFromString("string")).to.be.eq(SettingType.String);
          expect(settingTypeFromString("asdf")).to.be.eq(SettingType.String);
      });
  });

    describe("castValue", () =>{
        it("should return casted value", () => {
            const a = castValue("true", SettingType.Boolean);
            expect(castValue("true", SettingType.Boolean)).to.be.eq(true);
            expect(castValue("3", SettingType.Number)).to.be.eq(3);
            expect(castValue("asdf", SettingType.String)).to.be.eq("asdf");
        });
    });
});
