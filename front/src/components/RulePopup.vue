<template>
  <div class="test">
    <transition name="bg">
      <section v-if="showBg" class="bluredLayer"></section>
    </transition>
    <transition name="body">
      <div v-if="showBody" class="body" ref="RulePopup">
        <div class="ruleTitle">
          <textarea class="ruleName" @input="changeRulename($event)">{{
            currentRule?.rulename
          }}</textarea>
          <div class="ruleInfos">
            <p>
              SID du nouveau RuleSet :
              <!-- <a
                :href="`https://172.30.4.145/rules/rule/pk/${currentRule?.newSid}/`"
                >{{ currentRule?.newSid }}</a
              > -->
            </p>
            <p>
              SID de l'ancien RuleSet :
              <a
                :href="`https://172.30.4.145/rules/rule/pk/${currentRule?.sid}/`"
                >{{ currentRule?.sid }}</a
              >
            </p>
          </div>
        </div>

        <div class="importRulesSection">
          <textarea
            v-model="importArea"
            :name="`importArea-rule-${currentRule?.sid}`"
            :id="`importArea-rule-${currentRule?.sid}`"
            @keypress.enter="
              onlineStore.importRuleModifier(parseAlert(importArea))
            "
            spellcheck="false"
          ></textarea>
          <button
            @click="onlineStore.importRuleModifier(parseAlert(importArea))"
          >
            Importer
          </button>
        </div>

        <transition-group name="modifier">
          <RuleModifier
            v-for="(modifier, modifierIndex) in currentRule?.modifiers"
            :modifier="modifier"
            :modifierIndex="modifierIndex"
            :key="modifierIndex"
          />
        </transition-group>

        <div class="addBtn modifierAdd" @click="addModifier()">
          <Icon name="addSquared" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { debounce } from "lodash";
import RuleModifier from "@/components/ruleManager/RuleModifier.vue";
import { useRuleStore } from "@/stores/RulePopup";
import { onClickOutside } from "@vueuse/core";
import { useOnlineStore } from "@/stores/onlineDataStore";
import Icon from "./lib/Icon.vue";

const ruleStore = useRuleStore();
const onlineStore = useOnlineStore();
const importRulesSection = ref(false);
const importArea = ref();

const changeRulename = debounce((event) => {
  onlineStore.updateRuleName(event.target.value);
}, 700);

function parseAlert(alertString) {
  const parts = alertString.split(" ");
  const action = parts[0];
  const protocol = parts[1];
  // const srcIp = parts[2].includes(",") ? parts[2].split(",") : [parts[2]];
  // const srcPort = parts[3].includes(",") ? parts[3].split(",") : [parts[3]];
  // const destIp = parts[5].includes(",") ? parts[5].split(",") : [parts[5]];

  // Traitement pour srcIp
  let srcIpInclude = "";
  let srcIp = parts[2];
  if (srcIp.startsWith("!")) {
    srcIpInclude = "!";
    srcIp = srcIp.slice(1);
  }
  srcIp = srcIp.includes(",") ? srcIp.split(",") : [srcIp];

  // Traitement pour srcPort
  let srcPortInclude = "";
  let srcPort = parts[3];
  if (srcPort.startsWith("!")) {
    srcPortInclude = "!";
    srcPort = srcPort.slice(1);
  }
  srcPort = srcPort.includes(",") ? srcPort.split(",") : [srcPort];

  // Traitement pour destIp
  let destIpInclude = "";
  let destIp = parts[5];
  if (destIp.startsWith("!")) {
    destIpInclude = "!";
    destIp = destIp.slice(1);
  }
  destIp = destIp.includes(",") ? destIp.split(",") : [destIp];

  // Traiter destPort pour inclure les informations d'inclusion/exclusion
  let destPortInclude = "";
  let destPort = parts[6];

  if (destPort.startsWith("![")) {
    destPortInclude = "!";
    destPort = destPort.slice(2, -1).split(",");
  } else if (destPort.startsWith("[")) {
    destPortInclude = "";
    destPort = destPort.slice(1, -1).split(",");
  } else {
    destPort = [destPort];
  }

  const srcIpObject = {
    name: "srcIp",
    include: srcIpInclude,
    value: srcIp,
  };
  const srcPortObject = {
    name: "srcPort",
    include: srcPortInclude,
    value: srcPort,
  };
  const destIpObject = {
    name: "destIp",
    include: destIpInclude,
    value: destIp,
  };
  const destPortObject = {
    name: "destPort",
    include: destPortInclude,
    value: destPort,
  };

  // Partie options
  let options = [];

  let optionMatches;
  let optionsSection;

  // La regex pour extraire le contenu entre les parenthèses
  const optionsRegex = /\(([^;]*;[^()]*)\)/g;
  const optionRegex = /[^;]+/g;
  const keyValueRegex2 = /^(.*?):(.*)$/g;

  // Extraire la section d'options
  if ((optionsSection = optionsRegex.exec(alertString)) !== null) {
    console.log("Options trouvées : ", optionsSection[1]);
    let optionsSectionFiltered = optionsSection[1];

    // Utilisation de match avec le drapeau global pour trouver toutes les correspondances
    optionMatches = optionsSectionFiltered.match(optionRegex);
    if (optionMatches) {
      let lastOptionContent = null;
      optionMatches.forEach((option) => {
        const keyValueMatches = [...option.matchAll(keyValueRegex2)];
        if (keyValueMatches.length > 0) {
          keyValueMatches.forEach((keyValueMatch) => {
            let key = keyValueMatch[1].trim();
            let value = keyValueMatch[2].trim();
            value = value.replace(/\"/g, "");
            // value = value.replace(/\!/g, "");
            const objet = {
              name: key,
              value: value,
            };

            const objetContent = {
              name: key,
              value: value,
              include: "",
              depth: 0,
              within: 0,
              distance: 0,
              nocase: false,
              endswith: false,
            };

            if (key.includes("content")) {
              if (value.includes("!")) {
                objetContent.include = "!";
                objetContent.value = value.replace(/\!/, "");
              }
              lastOptionContent = objetContent;
              options.push(objetContent);
            } else if (
              key.includes("depth") ||
              key.includes("within") ||
              key.includes("distance")
            ) {
              options.pop();
              lastOptionContent[key.trim()] = Number(value);
              options.push(lastOptionContent);
            } else {
              lastOptionContent = null;
              options.push(objet);
            }
          });
        } else {
          if (lastOptionContent) {
            lastOptionContent[option.trim()] = true;
            options.pop();
            options.push(lastOptionContent);
          } else {
            const objet = {
              name: option.trim(),
              value: true,
            };
            // objet[option.trim()] = true;
            options.push(objet);
          }
        }
      });
    }
  }

  console.log("Option finales", options);

  const alertObject = {
    action,
    protocol,
    srcIp: srcIpObject,
    srcPort: srcPortObject,
    destIp: destIpObject,
    destPort: destPortObject,
    options,
  };

  return alertObject;
}

const currentRule = ref(null);

const showBg = ref(false);
const showBody = ref(false);

const RulePopup = ref(null);
onClickOutside(RulePopup, () => ruleStore.hide());

const addModifier = () => {
  onlineStore.addRuleModifier();
};

onMounted(() => {
  currentRule.value = onlineStore.getCurrentRule;
  setTimeout(() => {
    showBg.value = true;
    showBody.value = true;
  }, 100);
});
</script>

<!-- Transitions -->
<style>
.ruleContent-enter-active,
.ruleContent-leave-active {
  transition: scale 0.3s ease-out, opacity 0.2s ease-out;
}

.ruleContent-enter-from,
.ruleContent-leave-to {
  scale: 0;
  opacity: 0;
}

.bg-enter-active,
.bg-leave-active {
  transition: opacity 0.5s ease-out;
}

.bg-enter-from,
.bg-leave-to {
  opacity: 0;
}

.modifier-enter-active,
.modifier-leave-active {
  transition: all 0.2s ease-out;
}

.modifier-enter-from,
.modifier-leave-to {
  opacity: 0;
  scale: 0;
}

.body-enter-active,
.body-leave-active {
  transition: opacity 0.2s ease-out, scale 0.1s ease-out;
}

.body-enter-from,
.body-leave-to {
  opacity: 0;
  scale: 0.1;
}
</style>

<style lang="scss" scoped>
.bluredLayer {
  height: 100%;
  width: 100%;
  position: relative;
  backdrop-filter: blur(1px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 22;
}

.body {
  width: calc(60% - 2rem);
  max-height: calc(80%);
  overflow: auto;
  // aspect-ratio: 16/9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 23;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .ruleTitle {
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    .ruleName {
      margin: 0;
      text-align: start;
      border: none;
      outline: none;
      resize: none;
    }
    .ruleInfos {
      display: flex;
    }
  }

  .importRulesSection {
    textarea {
      width: 100%;
      min-height: 100px;
    }
  }

  .addBtns {
    display: flex;
    .addBtn {
      width: 50%;
    }
  }
  .addBtn {
    width: 100%;
    border-radius: 0.3rem;
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease-out;
    .icon {
      display: block;
      // fill: #676767;
      transition: all 0.2s ease-out;
    }
    &:hover {
      cursor: pointer;
    }

    &.modifierAdd {
      background-color: #dfdfdf;
      padding: 2rem 0;
      .icon {
        width: 25px;
        height: 25px;
        fill: #676767;
      }

      &:hover {
        .icon {
          scale: 1.1;
        }
      }
    }

    &.content {
      height: 20px;
      background-color: #d9d9d9;
      .icon {
        width: 20px;
        height: 20px;
        fill: transparent;
      }
      &:hover {
        cursor: pointer;
        .icon {
          fill: #676767;
          scale: 0.9;
        }
      }
    }
  }
}
</style>
