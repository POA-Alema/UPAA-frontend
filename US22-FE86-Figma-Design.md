# US22-FE86 - Figma Screens for MAPA

Estas são as telas de Figma que devem estar associadas a esta tarefa:

- Tela de mapa mobile com marcadores no Centro Histórico e controles de zoom.
- Tela de mapa com bolinhas vermelhas e navegação pelo painel inferior.
- Tela de detalhe da obra com painel de informações e botões de ação.

Use estas imagens como referência visual para a implementação da lógica de geolocalização, recentralização do mapa e alertas não bloqueantes.

## Onde incluir

- Adicione os prints ou as imagens finais na seção `Screenshots` do PR.
- Informe que o comportamento foi testado contra os fluxos de `Permissão negada`, `Dentro do limite` e `Fora do limite`.

## Pontos principais

- O mapa deve recentralizar no Centro Histórico quando o usuário estiver fora da área útil.
- O alerta deve ser acessível e multilíngue (`pt`, `de`, `en`).
- Não deve haver envio ou armazenamento das coordenadas do usuário no backend.
- Registrar analytics apenas com o motivo da ação, sem coordenadas sensíveis.
