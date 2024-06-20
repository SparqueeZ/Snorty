<template>
  <article class="modifier" :class="modifier.ruleVisible ? '' : 'archived'">
    <div class="modifier--commands">
      <div class="modifier--status">
        <div class="nameAndDesc">
          <textarea
            v-model="modifier.ruleName"
            name="modifierRuleName"
            id="modifierRuleName"
            class="text"
            @input="updateRuleModifier(modifier, modifierIndex)"
          ></textarea>
          <p
            :class="{
              import: modifier.ruleMethod === 'import',
              autoImport: modifier.ruleMethod === 'auto import',
              manual: modifier.ruleMethod === 'manual',
            }"
            class="modifierAddMethod"
          >
            {{ modifier.ruleMethod }}
          </p>
        </div>
        <div v-if="!modifier.ruleVisible" class="alertMessage">
          <div class="iconBox">
            <Icon name="warning" />
          </div>
          <p>
            Cette règle est désactivée, elle n'aura aucun effet en production.
          </p>
        </div>
      </div>
      <div class="modifier--actions">
        <div class="action" @click="exportRules()">
          <Icon name="downloadFile" />
        </div>
        <div
          class="action"
          @click="onlineStore.switchVisibleRuleModifier(modifierIndex)"
        >
          <Icon v-if="modifier.ruleVisible" name="visible" />
          <Icon v-else name="hide" />
        </div>
        <div
          class="action"
          @click="onlineStore.switchArchivedRuleModifier(modifierIndex)"
        >
          <Icon name="inbox" />
        </div>
        <div class="action" @click="removeRuleModifier()">
          <Icon name="delete" />
        </div>
      </div>
    </div>
    <div class="modifier--body">
      <div class="modifier--ips">
        <div class="modifier--ips--1">
          <div class="modifier--action">
            <div class="iconBox">
              <p>ACT</p>
            </div>
            <select
              v-model="modifier.action"
              :id="`modifier-${modifierIndex}-action`"
              @change="
                updateOption(modifierIndex, -2, 'action', modifier.action)
              "
            >
              <option value="alert">alert</option>
              <option value="pass">pass</option>
              <option value="drop">drop</option>
              <option value="reject">reject</option>
              <option value="rejectsrc">rejectsrc</option>
              <option value="rejectdst">rejectdst</option>
              <option value="rejectboth">rejectboth</option>
            </select>
          </div>
          <div class="modifier--protocol">
            <div class="iconBox">
              <p>PTCL</p>
            </div>
            <select
              v-model="modifier.protocol"
              :id="`modifier-${modifierIndex}-protocol`"
              @change="
                updateOption(modifierIndex, -2, 'protocol', modifier.protocol)
              "
            >
              <option value="tcp">tcp</option>
              <option value="udp">udp</option>
              <option value="icmp">icmp</option>
              <option value="ip">ip</option>
              <option value="http">http</option>
              <option value="http1">http1</option>
              <option value="http2">http2</option>
              <option value="ftp">ftp</option>
              <option value="tls">tls</option>
              <option value="smb">smb</option>
              <option value="dns">dns</option>
              <option value="dcerpc">dcerpc</option>
              <option value="dhcp">dhcp</option>
              <option value="ssh">ssh</option>
              <option value="smtp">smtp</option>
              <option value="imap">imap</option>
              <option value="pop3">pop3</option>
              <option value="modbus">modbus</option>
              <option value="dnp3">dnp3</option>
              <option value="enip">enip</option>
              <option value="nfs">nfs</option>
              <option value="ike">ike</option>
              <option value="krb5">krb5</option>
              <option value="bittorrent-dht">bittorrent-dht</option>
              <option value="ntp">ntp</option>
              <option value="rfb">rfb</option>
              <option value="rdp">rdp</option>
              <option value="snmp">snmp</option>
              <option value="tftp">tftp</option>
              <option value="sip">sip</option>
              <option value="websocket">websocket</option>
            </select>
          </div>
        </div>

        <div class="modifier--ips--2">
          <div class="modifier--src">
            <div class="iconBox">
              <p>SRC</p>
            </div>
            <select
              v-model="modifier.ip_src.include"
              :name="`ip-src-include-${modifierIndex}`"
              :id="`ip-src-include-${modifierIndex}`"
              @change="
                updateOption(
                  modifierIndex,
                  -1,
                  'ip_src_include',
                  modifier.ip_src.include
                )
              "
            >
              <option value="">==</option>
              <option value="!">!=</option>
            </select>

            <textarea
              class="ipInput"
              :name="`ip-src-${modifierIndex}`"
              :id="`ip-src-${modifierIndex}`"
              @input="updateIpsData(modifierIndex, 'ip_src', $event)"
              >{{ modifier.ip_src.value?.join(", ") }}</textarea
            >
            <select
              v-model="modifier.port_src.include"
              :name="`port-src-include-${modifierIndex}`"
              :id="`port-src-include-${modifierIndex}`"
              @change="
                updateOption(
                  modifierIndex,
                  -1,
                  'port_src_include',
                  modifier.port_src.include
                )
              "
            >
              <option value="">==</option>
              <option value="!">!=</option>
            </select>
            <textarea
              class="portInput"
              :name="`port-src-${modifierIndex}`"
              :id="`port-src-${modifierIndex}`"
              @input="updateIpsData(modifierIndex, 'port_src', $event)"
              >{{ modifier.port_src.value?.join(", ") }}</textarea
            >
          </div>
          <div class="modifier--dest">
            <div class="iconBox">
              <p>DST</p>
            </div>
            <select
              v-model="modifier.ip_dest.include"
              :name="`ip-dest-include-${modifierIndex}`"
              :id="`ip-dest-include-${modifierIndex}`"
              @change="
                updateOption(
                  modifierIndex,
                  -1,
                  'ip_dest_include',
                  modifier.ip_dest.include
                )
              "
            >
              <option value="">==</option>
              <option value="!">!=</option>
            </select>
            <textarea
              class="ipInput"
              :name="`ip-dest-${modifierIndex}`"
              :id="`ip-dest-${modifierIndex}`"
              @input="updateIpsData(modifierIndex, 'ip_dest', $event)"
              >{{ modifier.ip_dest.value?.join(", ") }}</textarea
            >
            <select
              v-model="modifier.port_dest.include"
              :name="`port-dest-include-${modifierIndex}`"
              :id="`port-dest-include-${modifierIndex}`"
              @change="
                updateOption(
                  modifierIndex,
                  -1,
                  'port_dest_include',
                  modifier.port_dest.include
                )
              "
            >
              <option value="">==</option>
              <option value="!">!=</option>
            </select>
            <textarea
              class="portInput"
              :name="`port-dest-${modifierIndex}`"
              :id="`port-dest-${modifierIndex}`"
              @input="updateIpsData(modifierIndex, 'port_dest', $event)"
              >{{ modifier.port_dest.value?.join(", ") }}</textarea
            >
          </div>
        </div>
      </div>

      <div class="modifier--contents--container" :style="calcHeight(modifier)">
        <transition-group name="ruleContent">
          <div
            class="modifier--contents"
            v-for="(content, contentIndex) in modifier.options"
            :key="contentIndex"
          >
            <div class="modifer--contents--actions">
              <div
                class="action"
                @click="
                  onlineStore.deleteRuleOption(modifierIndex, contentIndex)
                "
              >
                <Icon name="delete" />
              </div>
            </div>
            <div
              class="modifer--contents--body"
              :class="
                content.name === 'msg' || content.name === 'metadata'
                  ? 'variableHeight'
                  : ''
              "
            >
              <div class="content--top">
                <div class="content--option" data-function="name">
                  <textarea
                    class="content--name"
                    v-model="content.name"
                    :id="`modifier-${modifierIndex}-content-${contentIndex}-name`"
                    placeholder="Nom"
                    @input="
                      updateOption(
                        modifierIndex,
                        contentIndex,
                        'name',
                        content.name
                      )
                    "
                  >
                  </textarea>
                </div>

                <div
                  class="content--option"
                  data-function="include"
                  title="! : recherche l'absence de la chaîne spécifiée dans le payload. | = : recherche la présence de la chaîne spécifiée dans le payload."
                >
                  <select
                    v-model="content.include"
                    :id="`modifier-${modifierIndex}-content-${contentIndex}-include`"
                    v-if="content.name === 'content'"
                  >
                    <option value="">=</option>
                    <option value="!">!</option>
                  </select>
                </div>

                <div class="content--option value" data-function="value">
                  <textarea
                    class="content--value"
                    v-model="content.value"
                    :id="`modifier-${modifierIndex}-content-${contentIndex}-name`"
                    @input="
                      updateOption(
                        modifierIndex,
                        contentIndex,
                        'value',
                        content.value
                      )
                    "
                    placeholder="Valeur de l'option"
                    spellcheck="false"
                  >
                  </textarea>
                </div>
              </div>

              <div class="content--bottom" v-if="content.name === 'content'">
                <article
                  class="content--article"
                  title="Spécifie le nombre maximum d'octets après le début de la recherche, dans lequel la correspondance suivante doit être trouvée"
                >
                  <div class="content--option">
                    <p>Within</p>
                  </div>
                  <div class="content--option">
                    <div class="optionParamValue">
                      <input v-model="content.within" type="number" />
                    </div>
                  </div>
                </article>

                <article
                  class="content--article"
                  title="Spécifie le nombre d'octets à ignorer après la fin de la correspondance précédente avant de commencer à rechercher la correspondance suivante."
                >
                  <div class="content--option">
                    <p>Distance</p>
                  </div>
                  <div class="content--option">
                    <div class="optionParamValue">
                      <input v-model="content.distance" type="number" />
                    </div>
                  </div>
                </article>

                <article
                  class="content--article"
                  title="Limite la recherche de la correspondance de contenu au nombre d'octets spécifié depuis le début du payload."
                >
                  <div class="content--option">
                    <p>Depth</p>
                  </div>
                  <div class="content--option">
                    <div class="optionParamValue">
                      <input v-model="content.depth" type="number" />
                    </div>
                  </div>
                </article>

                <div
                  class="content--option"
                  title="Cette option indique que la recherche de la chaîne de contenu doit être insensible à la maj."
                  @click="
                    updateOption(
                      modifierIndex,
                      contentIndex,
                      'nocase',
                      !content.nocase
                    )
                  "
                >
                  <div
                    class="contentStandalone"
                    :class="content.nocase ? 'on' : 'off'"
                  >
                    <p>nocase</p>
                  </div>
                </div>
                <div
                  class="content--option"
                  title="Cette option est utilisée pour indiquer que le contenu spécifié doit correspondre à la fin du payload de l'attaque ou de la séquence d'octets analysée."
                  @click="
                    updateOption(
                      modifierIndex,
                      contentIndex,
                      'endswith',
                      !content.endswith
                    )
                  "
                >
                  <div
                    class="contentStandalone"
                    :class="content.endswith ? 'on' : 'off'"
                  >
                    <p>endswith</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
      <div class="addBtns">
        <div
          class="addBtn content"
          @click="addRuleOption(modifierIndex, 'content')"
        >
          <Icon name="addSquared" />
        </div>
        <div class="addBtn content" @click="addRuleOption(modifierIndex, '')">
          <Icon name="addSquared" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import Icon from "../lib/Icon.vue";
import { debounce } from "lodash";
import Loader from "@/components/lib/Loader.vue";
import apiClient from "@/assets/axios";
import { useOnlineStore } from "@/stores/onlineDataStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { ref, onMounted } from "vue";
const onlineStore = useOnlineStore();
const loaderStore = useLoaderStore();

const props = defineProps({
  modifier: Object,
  modifierIndex: Number,
});

const removeRuleModifier = () => {
  console.log(props.modifierIndex);
  onlineStore.removeRuleModifier(props.modifierIndex);
};

// Fonction permettant de calculer la hauteur du body du modifier.
function calcHeight(modifier) {
  const contentCount = modifier.options.filter(
    (m) => m.name === "content"
  ).length;
  const metadataCount = modifier.options.filter(
    (m) => m.name === "metadata"
  ).length;
  const msgCount = modifier.options.filter((m) => m.name === "msg").length;
  return `height: ${
    65 * modifier.options.length +
    45 * contentCount +
    48 * metadataCount +
    48 * msgCount
  }px;`;
}

// Fonction permettant de convertir la liste d'adresses ip en chaine de caractère.
function ruleConvertArrayToString(array) {
  if (array.length === 1) {
    return array[0];
  } else return `[${array.join(",")}]`;
}

// Fonction permettant d'ajouter une option dans un modifier.
function addRuleOption(modifierIndex, type) {
  onlineStore.addRuleOption(modifierIndex, type);
}

// Fonction permettant de mettre à jour un modifier avec toutes les informations.
const updateRuleModifier = debounce((modifier, index) => {
  onlineStore.updateRuleModifier(modifier, index);
}, 700);

// Fonction permettant de mettre à jour les informations de l'adresse ip + ports
function updateIpsData(modifierIndex, type, event) {
  const str = event.target.value;
  const arr = str.split(",").map((item) => item.trim());
  updateOption(modifierIndex, -1, type, arr);
}

let debounceTimeout;
// Fonction permettant de mettre à jour une option spécifiée.
const updateOption = (modifierIndex, optionIndex, type, value) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(
    () => {
      onlineStore.updateOption(modifierIndex, optionIndex, type, value);
    },
    type === "name" ? 300 : type === "value" ? 300 : 0
  );
};

// Fonction permettant d'exporter toutes les règles au format txt.
const exportRules = () => {
  const rules = onlineStore.getRules;
  let rulesArray = [];
  rules.forEach((rule) => {
    rule.modifiers.forEach((m) => {
      const ruleInfos = `${m.action} ${m.protocol} ${
        m.ip_src.include
      }${ruleConvertArrayToString(m.ip_src.value)} ${
        m.port_src.include
      }${ruleConvertArrayToString(m.port_src.value)} -> ${
        m.ip_dest.include
      }${ruleConvertArrayToString(m.ip_dest.value)} ${
        m.port_dest.include
      }${ruleConvertArrayToString(m.port_dest.value)}`;
      let ruleOptions = "";
      let optionsTags = "";

      m.options.forEach((o) => {
        if (o) {
          o.name.replace(/"/g, "");

          if (o.name === "msg") ruleOptions += `${o.name}:"🏥${o.value}";`;
          if (o.name === "content") {
            if (o.include) ruleOptions += ` ${o.name}:!"${o.value}";`;
            else ruleOptions += ` ${o.name}:"${o.value}";`;
            // Suite
            if (o.endswith) ruleOptions += ` endswith;`;
            if (o.nocase) ruleOptions += ` nocase;`;
            if (o.depth) ruleOptions += ` depth:${o.depth};`;
            if (o.within) ruleOptions += ` within:${o.within};`;
            if (o.distance) ruleOptions += ` distance:${o.distance};`;
          } else if (
            o.name !== "msg" &&
            o.name !== "content" &&
            o.value === true
          ) {
            ruleOptions += ` ${o.name};`;
          } else if (o.name !== "msg" && o.name !== "content") {
            ruleOptions += ` ${o.name}:${o.value};`;
          }
        }
      });
      const isVisible = !m.ruleVisible ? "#" : "";
      rulesArray.push(`${isVisible}${ruleInfos} (${ruleOptions})`);
    });
  });
  exportRulesToTxt(rulesArray);
};

// Fonction permettant de faire un appel au backend afin de créer un fichier .txt avec toutes les règles.
const exportRulesToTxt = async (array) => {
  try {
    const response = await apiClient.post(
      `${import.meta.env.VITE_SELKSC_API_URL}/api/export/export-rule`,
      array
    );

    loaderStore.show();
    setTimeout(() => {
      downloadRules();
      loaderStore.hide();
      onlineStore.updateCurrentAlertStatus(true, `Fait le $date`);
    }, 1000);
  } catch (error) {
    console.warn("Erreur lors de la requête HTTP : ", error);
  }
};

// Fonction permettant de télécharger automatiquement le fichier de règles.
const downloadRules = () => {
  const url = `${
    import.meta.env.VITE_SELKSC_API_URL
  }/api/export/download-rules`;
  const link = document.createElement("a");
  link.href = url;
  link.download = "rules.tar.gz";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style lang="scss" scoped>
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

.modifier {
  &.archived {
    opacity: 0.7;
    filter: brightness(0.9);
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #efefef;
  gap: 1rem;
  padding: 2rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease-out;

  .modifier--commands {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .modifier--status {
      display: flex;
      gap: 1rem;
      .nameAndDesc {
        .text {
          height: 1.5rem;
        }
        .modifierAddMethod {
          border-radius: 0.2rem;
          color: #fff;
          padding: 0rem 1rem 0.1rem;
          width: fit-content;
          &.import {
            background-color: #849324;
          }
          &.autoImport {
            background-color: #016fb9;
          }
          &.manual {
            background-color: #ffb30f;
          }
        }
      }

      .alertMessage {
        display: flex;
        gap: 0.5rem;
        .iconBox {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          border-radius: 0.3rem;
          width: 25px;
          height: 25px;
          .icon {
            display: block;
            width: 17px;
            height: 20px;
            fill: orange;
          }
        }
      }

      p {
        margin: 0;
      }
    }

    .modifier--actions {
      gap: 0.3rem;
      display: flex;
      justify-content: end;
      .action {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.3rem;
        width: 25px;
        height: 25px;
        transition: all 0.2s ease-out;
        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 18px;
          height: 18px;
        }
        &:hover {
          background-color: #d9d9d9;
          cursor: pointer;
        }
      }
    }
  }

  .modifier--body {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    textarea {
      resize: none;
    }

    .modifier--ips {
      gap: 0.5rem;
      display: flex;
      flex-direction: column;
      width: 100%;

      .modifier--ips--1 {
        display: flex;
        gap: 1rem;
      }
      .modifier--ips--2 {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.5rem;
        width: 100%;
      }
      .modifier--src,
      .modifier--action,
      .modifier--protocol,
      .modifier--dest {
        display: flex;
        justify-content: center;
        gap: 1rem;
        height: 30px;
        overflow: hidden;

        .iconBox {
          height: 100%;
          aspect-ratio: 1/1;
          border-radius: 0.3rem;
          background-color: #d9d9d9;
          display: flex;
          align-items: center;
          justify-content: center;
          p {
            margin: 0;
            font-size: 10px;
            font-weight: 700;
          }
        }

        select {
          height: 100%;
          background-color: #d9d9d9;
          border-radius: 0.3rem;
          border: 0;
          &:focus-visible {
            outline: none;
          }
          &:hover {
            cursor: pointer;
          }
        }
        textarea {
          background-color: #d9d9d9;
          border-radius: 0.3rem;
          outline: 0;
          padding-top: 9px;
          padding-bottom: 4px;
          padding-left: 10px;
          border: 0;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;

          &.ipInput {
            width: 110px;
          }

          &.portInput {
            width: 48px;
          }
        }
      }
    }
    .modifier--contents--container {
      display: flex;
      flex-direction: column;
      // gap: 2rem;
      height: 0px;
      overflow: hidden;
      transition: all 0.2s ease-out;
      .modifier--contents {
        display: flex;
        flex-shrink: 0;
        gap: 1rem;
        padding: 1rem 0;
        border-top: 1px solid #bfbfbf;

        .modifer--contents--actions {
          display: flex;
          justify-content: center;
          align-items: start;
          .action {
            width: 30px;
            // height: 100%;
            aspect-ratio: 1/1;
            border-radius: 0.3rem;
            background-color: #d9d9d9;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon {
              display: block;
              width: 20px;
              height: 20px;
              transition: all 0.1s ease-out;
            }
            &:hover {
              cursor: pointer;
              .icon {
                scale: 0.95;
                fill: red;
              }
            }
          }
        }

        .modifer--contents--body {
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 1rem;

          .content--top {
            display: flex;
            height: 30px;
            gap: 1rem;
            justify-content: space-between;

            .content--option {
              background-color: #dfdfdf;
              border-radius: 0.3rem;
              flex-shrink: 0;
              overflow: hidden;

              &[data-function="name"] {
                min-width: 120px;
              }

              select {
                height: 100%;
                background-color: #dfdfdf;
                border: 0;
                &:focus-visible {
                  outline: none;
                }
                &:hover {
                  cursor: pointer;
                }
              }
              textarea {
                outline: 0;
                // height: calc(100% - 10px);
                height: 100%;
                width: calc(100% - 2rem);
                // padding: 5px 0;
                padding-top: 7px;
                border: 0;
                background-color: transparent;
                font-size: 15px;
                font-family: Arial, Helvetica, sans-serif;
                margin: 0 1rem;
                text-wrap: nowrap;
              }
              &.value {
                width: 75%;
                max-width: 534.3px;
                overflow: hidden;
              }
            }
          }

          .content--bottom {
            display: flex;
            align-items: center;
            height: 30px;
            gap: 1rem;
            .content--article {
              display: flex;
              gap: 0.5rem;
            }
            .content--option {
              background-color: #dfdfdf;
              border-radius: 0.3rem;
              height: 30px;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              p {
                margin: 0 1rem;
              }

              .contentStandalone {
                display: flex;
                align-items: center;
                height: 100%;
                transition: all 0.2s ease-out;
                cursor: pointer;
                &.on {
                  background-color: #016fb9;
                  p {
                    color: #fff;
                  }
                }
                &.off {
                  background-color: transparent;
                }
              }

              input {
                height: 100%;
                background-color: transparent;
                border: 0;
                outline: none;
                max-width: 2.5rem;
                &[type="checkbox"] {
                  margin: 0 1rem 0 0;
                }
              }

              select {
                height: 100%;
                background-color: #dfdfdf;
                border: 0;
                &:focus-visible {
                  outline: none;
                }
                &:hover {
                  cursor: pointer;
                }
              }
              textarea {
                outline: 0;
                // height: calc(100% - 10px);
                height: 100%;
                width: 100%;
                // padding: 5px 0;
                padding-top: 7px;
                margin: 0 0 0 1rem;
                border: 0;
                background-color: transparent;
                font-family: Arial, Helvetica, sans-serif;
              }
              &.value {
                width: 75%;
              }
            }
          }

          &.variableHeight {
            height: 80px;
            align-items: start;
            p {
              margin: 0;
            }
            .content--top {
              height: 100%;
              width: 100%;
              .content--option {
                height: 30px;
                &.value {
                  height: 100%;
                  width: 100%;
                }
                textarea {
                  height: 100%;
                  overflow: hidden;
                }
              }
            }
          }

          .content--name {
            max-width: 100px;
            overflow-x: auto;
            overflow-y: hidden;
            &::-webkit-scrollbar {
              display: none;
            }
          }

          .addBtn {
            // width: 100%;
            height: 20px;
            border-radius: 0.3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.1s ease-out;
            .icon {
              width: 20px;
              height: 20px;
              display: block;
              fill: #fff;
            }
            &:hover {
              cursor: pointer;
              .icon {
                fill: #676767;
              }
            }
          }
        }
      }
    }
  }
}
</style>
